import { customPath } from '../utils/utils';
import { GENERAL_CONFIG } from './general.config';
import * as fs from 'fs';

export class ConfigHelperService {
  private readonly tasks: any[];
  private readonly seasons: any[];
  private readonly main: any;

  constructor() {
    this.tasks = this.loadFile(customPath(GENERAL_CONFIG.seeds.tasks));
    this.seasons = this.loadFile(customPath(GENERAL_CONFIG.seeds.seasons));
    this.main = this.loadFile(customPath(GENERAL_CONFIG.seeds.main));
  }

  private loadFile(filePath: string): any[] {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }

  getTasks(): any[] {
    return this.tasks;
  }

  getSeasons(): any[] {
    return this.seasons;
  }

  getMain(): any {
    return this.main;
  }
}
