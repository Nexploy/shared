export interface NamedResource {
    name: string;
}

export interface TaggedResource {
    repoTags?: string[];
}

export const BUILTIN_NETWORKS = ['bridge', 'host', 'none'] as const;

export function isBuiltinNetwork(name: string): boolean {
    return (BUILTIN_NETWORKS as readonly string[]).includes(name);
}

export const NEXPLOY_INFRASTRUCTURE_CONTAINERS = [
    'nexploy_app',
    'nexploy_docker_api',
    'nexploy_traefik',
    'nexploy_postgres',
    'nexploy_inngest',
    'nexploy_upgrader',
];

export const NEXPLOY_INFRASTRUCTURE_NETWORKS = ['nexploy_network', 'nexploy_traefik_network'];

export const NEXPLOY_INFRASTRUCTURE_VOLUMES = ['nexploy_db', 'nexploy_traefik_acme', 'nexploy_deployer_workdir'];

export const NEXPLOY_INFRASTRUCTURE_IMAGE_REPOSITORIES = ['nexploy/nexploy', 'nexploy/docker-api'];

export function isNexployInfrastructureContainer(container: NamedResource): boolean {
    const name = container.name.replace(/^\//, '');
    return NEXPLOY_INFRASTRUCTURE_CONTAINERS.includes(name);
}

export function isNexployInfrastructureContainerName(containerName: string): boolean {
    return isNexployInfrastructureContainer({ name: containerName });
}

export function isNexployInfrastructureNetwork(network: NamedResource): boolean {
    return NEXPLOY_INFRASTRUCTURE_NETWORKS.includes(network.name);
}

export function isNexployInfrastructureNetworkName(networkName: string): boolean {
    return NEXPLOY_INFRASTRUCTURE_NETWORKS.includes(networkName);
}

export function isNexployInfrastructureVolume(volume: NamedResource): boolean {
    return NEXPLOY_INFRASTRUCTURE_VOLUMES.includes(volume.name);
}

export function isNexployInfrastructureVolumeName(volumeName: string): boolean {
    return NEXPLOY_INFRASTRUCTURE_VOLUMES.includes(volumeName);
}

export function isNexployInfrastructureImageReference(reference: string): boolean {
    const withoutDigest = reference.split('@')[0] ?? '';
    const tagSeparator = withoutDigest.indexOf(':', withoutDigest.lastIndexOf('/') + 1);
    const repository = tagSeparator === -1 ? withoutDigest : withoutDigest.slice(0, tagSeparator);

    return NEXPLOY_INFRASTRUCTURE_IMAGE_REPOSITORIES.some(
        (infrastructure) => repository === infrastructure || repository.endsWith(`/${infrastructure}`),
    );
}

export function isNexployInfrastructureImage(image: TaggedResource): boolean {
    return (image.repoTags ?? []).some(isNexployInfrastructureImageReference);
}

export function filterNexployContainers<T extends NamedResource>(containers: T[]): T[] {
    return containers.filter((container) => !isNexployInfrastructureContainer(container));
}

export function filterNexployVolumes<T extends NamedResource>(volumes: T[]): T[] {
    return volumes.filter((volume) => !isNexployInfrastructureVolume(volume));
}

export function filterNexployNetworks<T extends NamedResource>(networks: T[]): T[] {
    return networks.filter((network) => !isNexployInfrastructureNetwork(network));
}

export function filterNexployImages<T extends TaggedResource>(images: T[]): T[] {
    return images.filter((image) => !isNexployInfrastructureImage(image));
}
