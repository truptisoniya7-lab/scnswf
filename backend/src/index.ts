import { createApp } from './app';
import { env } from './config/env';
import { initFirebase } from './db/firebase';

const startServer = async () => {
  // Initialize optional Firebase service if configured
  initFirebase();

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log('====================================================');
    console.log('🚀 SCNSWF Express TypeScript API Server Online');
    console.log(`🌐 Base URL:      http://localhost:${env.PORT}`);
    console.log(`🩺 Health check:  http://localhost:${env.PORT}/api/v1/health/`);
    console.log(`📚 Swagger UI:    http://localhost:${env.PORT}/api/v1/schema/swagger-ui/`);
    console.log(`📑 OpenAPI JSON:  http://localhost:${env.PORT}/api/v1/schema/`);
    console.log(`⚙️  Environment:   ${env.NODE_ENV}`);
    console.log(`🔐 Admin account: ${env.DEFAULT_ADMIN_EMAIL}`);
    console.log('====================================================');
  });

  const shutdown = (signal: string) => {
    console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
    server.close(() => {
      console.log('💤 HTTP server closed. Process terminating.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
};

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
