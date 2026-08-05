export const NEXPLOY_LABEL_PREFIX = 'nexploy.';

export const DOCKER_LABEL_PREFIX = 'com.docker.';

export const PROTECTED_LABEL_PREFIXES = [NEXPLOY_LABEL_PREFIX, DOCKER_LABEL_PREFIX] as const;

export function isNexployManagedLabelKey(key: string): boolean {
    return key.trim().toLowerCase().startsWith(NEXPLOY_LABEL_PREFIX);
}

export function isProtectedLabelKey(key: string): boolean {
    const normalized = key.trim().toLowerCase();
    return PROTECTED_LABEL_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function stripProtectedLabelEntries<T extends { key: string }>(labels: T[]): T[] {
    return labels.filter((label) => !isProtectedLabelKey(label.key));
}

export function stripProtectedLabelRecord<T>(labels: Record<string, T>): Record<string, T> {
    return Object.fromEntries(Object.entries(labels).filter(([key]) => !isProtectedLabelKey(key)));
}

export function stripNexployManagedLabels<T>(labels: Record<string, T>): Record<string, T> {
    return Object.fromEntries(Object.entries(labels).filter(([key]) => !isNexployManagedLabelKey(key)));
}
