export const NEXPLOY_ORGANIZATION_LABEL = 'nexploy.organizationId';
export const NEXPLOY_REPOSITORY_LABEL = 'nexploy.repositoryId';
export const COMPOSE_PROJECT_LABEL = 'com.docker.compose.project';

export type OwnershipLabels = Record<string, string> | null | undefined;

export interface OwnedResource {
    labels?: OwnershipLabels;
}

export interface Viewer {
    role: string | null;
    organizationId: string | null;
}

export type RepositoryOrganizations = Record<string, string>;

export function isPrivilegedViewer(viewer: Viewer): boolean {
    return viewer.role === 'admin' || viewer.role === 'system';
}

export function ownerOrganizationId(
    labels: OwnershipLabels,
    repositoryOrganizations: RepositoryOrganizations = {},
): string | null {
    const direct = labels?.[NEXPLOY_ORGANIZATION_LABEL];
    if (direct) return direct;

    const repositoryId = labels?.[NEXPLOY_REPOSITORY_LABEL];
    if (repositoryId) return repositoryOrganizations[repositoryId] ?? null;

    return null;
}

export function isVisibleToViewer(
    labels: OwnershipLabels,
    viewer: Viewer,
    repositoryOrganizations: RepositoryOrganizations = {},
): boolean {
    if (isPrivilegedViewer(viewer)) return true;

    const owner = ownerOrganizationId(labels, repositoryOrganizations);
    if (!owner) return true;

    return owner === viewer.organizationId;
}

export function filterVisibleToViewer<T extends OwnedResource>(
    resources: T[],
    viewer: Viewer,
    repositoryOrganizations: RepositoryOrganizations = {},
): T[] {
    if (isPrivilegedViewer(viewer)) return resources;

    return resources.filter((resource) => isVisibleToViewer(resource.labels, viewer, repositoryOrganizations));
}

export function withResolvedOwner<T extends OwnedResource>(
    resource: T,
    repositoryOrganizations: RepositoryOrganizations = {},
): T {
    const owner = ownerOrganizationId(resource.labels, repositoryOrganizations);
    if (!owner || resource.labels?.[NEXPLOY_ORGANIZATION_LABEL] === owner) return resource;

    return { ...resource, labels: { ...(resource.labels ?? {}), [NEXPLOY_ORGANIZATION_LABEL]: owner } };
}

export function stackOwnerOrganizationId(
    containers: OwnedResource[],
    repositoryOrganizations: RepositoryOrganizations = {},
): string | null {
    for (const container of containers) {
        const owner = ownerOrganizationId(container.labels, repositoryOrganizations);
        if (owner) return owner;
    }

    return null;
}
