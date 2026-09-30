import logging
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler matching SCNSWF API specification:
    {
        "error": {
            "code": "validation_error",
            "message": "One or more fields are invalid.",
            "details": { ... }
        }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        code = getattr(exc, 'default_code', 'error')
        message = 'An error occurred.'
        details = {}

        if isinstance(response.data, dict):
            if 'detail' in response.data:
                message = str(response.data['detail'])
                details = {}
            else:
                code = 'validation_error'
                message = 'One or more fields are invalid.'
                details = response.data
        elif isinstance(response.data, list):
            code = 'validation_error'
            message = 'Validation error occurred.'
            details = {'non_field_errors': response.data}

        response.data = {
            'error': {
                'code': str(code),
                'message': message,
                'details': details,
            }
        }
    else:
        logger.exception("Unhandled server exception: %s", exc)
        response = Response(
            {
                'error': {
                    'code': 'server_error',
                    'message': 'An unexpected server error occurred.',
                    'details': {},
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
