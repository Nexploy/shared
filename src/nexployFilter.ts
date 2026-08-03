export interface NamedResource {
    name: string;
}

export const BUILTIN_NETWORKS = ['bridge', 'host', 'none'] as const;

export function isBuiltinNetwork(name: string): boolean {
    return (BUILTIN_NETWORKS as readonly string[]).includes(name);
}

export const NEXPLOY_INFRASTRUCTURE_CONTAINERS = [
    'nexploy_traefik',
    'nexploy_postgres',
    'nexploy_inngest',
    'nexploy_app',
    'nexploy_docker_api',
    'nexploy_upgrader',
];

export const NEXPLOY_INFRASTRUCTURE_NETWORKS = ['nexploy_network'];

export function isNexployInfrastructureContainer(container: NamedResource): boolean {
    const name = container.name.replace(/^\//, '');
    return NEXPLOY_INFRASTRUCTURE_CONTAINERS.includes(name);
}

export function isNexployInfrastructureNetwork(network: NamedResource): boolean {
    return NEXPLOY_INFRASTRUCTURE_NETWORKS.includes(network.name);
}

export function isNexployInfrastructureNetworkName(networkName: string): boolean {
    return NEXPLOY_INFRASTRUCTURE_NETWORKS.includes(networkName);
}

export function filterNexployContainers<T extends NamedResource>(containers: T[]): T[] {
    return containers.filter((container) => !isNexployInfrastructureContainer(container));
}

export function filterNexployNetworks<T extends NamedResource>(networks: T[]): T[] {
    return networks.filter((network) => !isNexployInfrastructureNetwork(network));
}
