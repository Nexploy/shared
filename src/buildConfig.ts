import type { WebhookTrigger } from './webhook.js';

export interface BuildConfig {
    userId: string;
    repositoryName: string;
    gitAccountId?: string;
    repositoryId: string;
    organizationId?: string;
    gitProvider: 'GITHUB' | 'GITLAB' | 'GITEA' | 'BITBUCKET' | 'AZURE_REPOS';
    gitUrl: string;
    gitBranch?: string;
    buildId: string;
    triggerSource: 'manual' | 'webhook';
    webhookTrigger?: WebhookTrigger;
    stageId?: string;
    environmentId?: string;
}
