import fs from 'fs';
import path from 'path';
import { DatabaseState, getInitialSeedData } from './seedData';

class JsonStore {
  private data: DatabaseState;
  private filePath: string;

  constructor() {
    const dataDir = path.resolve(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (err) {
        console.warn('Could not create data directory, using memory only:', err);
      }
    }
    this.filePath = path.join(dataDir, 'db.json');
    this.data = this.loadData();
  }

  private loadData(): DatabaseState {
    try {
      if (fs.existsSync(this.filePath)) {
        const fileContent = fs.readFileSync(this.filePath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Ensure all collections exist
        const initial = getInitialSeedData();
        return {
          ...initial,
          ...parsed,
        };
      }
    } catch (err) {
      console.warn('Error reading db.json, initializing fresh store:', err);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(state: DatabaseState): void {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(state, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Warning: Failed to persist db.json to disk:', err);
    }
  }

  public getState(): DatabaseState {
    return this.data;
  }

  public update(updater: (state: DatabaseState) => void): DatabaseState {
    updater(this.data);
    this.saveData(this.data);
    return this.data;
  }
}

export const dbStore = new JsonStore();
