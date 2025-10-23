export type NavigationItem = {
    id: string
    label: string
    href: string
}

export type Tab = {
    id: string
    title: string
    content: string
}

export type TabsBuilderStep = 1 | 2 | 3

export type StorageData = {
    tabs: Tab[]
    activeTabId?: string
    lastModified?: string
}

export type PlaceholderPageProps = {
    title: string
    icon: string
}
