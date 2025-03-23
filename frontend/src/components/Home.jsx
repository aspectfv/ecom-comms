function ItemCard({ item }) {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={item.images[0] || 'https://placehold.co/300x200?text=No+Image'}
                    height={200}
                    alt={item.name}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{item.name}</Text>
            </Group>

            <Text size="xl" fw={700} c="blue">
                ${item.price.toFixed(2)}
            </Text>
        </Card>
    );
}

export default function Home() {
    const items = useLoaderData();
    const prelovedItems = items.filter(item => item.type === 'preloved');
    const brandnewItems = items.filter(item => item.type === 'brandnew');

    return (
        <Box>
            {/* Header */}
            <MantineHeader height={60} px="md">
                <Flex h="100%" justify="space-between" align="center">
                    <Title order={2}>Merca Finds</Title>
                    <Anchor component={Link} to="/login">Login</Anchor>
                </Flex>
            </MantineHeader>

            {/* Main Content */}
            <Container size="xl" py="xl">
                <Title ta="center" mb="xl">Welcome to Merca Finds!</Title>

                <Title order={2} mb="md">Categories</Title>
                <Tabs defaultValue="preloved" mb="xl">
                    <Tabs.List>
                        <Tabs.Tab value="preloved">Pre-loved Items</Tabs.Tab>
                        <Tabs.Tab value="brandnew">Brand New Products</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="preloved" pt="md">
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                            {prelovedItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </SimpleGrid>
                    </Tabs.Panel>

                    <Tabs.Panel value="brandnew" pt="md">
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                            {brandnewItems.map(item => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </SimpleGrid>
                    </Tabs.Panel>
                </Tabs>

                <Space h="xl" />

                <Title order={2} mb="md">Pre-loved Items</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {prelovedItems.slice(0, 4).map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </SimpleGrid>

                <Space h="xl" />

                <Title order={2} mb="md">Brand New Products</Title>
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="md">
                    {brandnewItems.slice(0, 4).map(item => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </SimpleGrid>
            </Container>

            {/* Footer */}
            <Footer height="auto" p="md">
                <Container size="xl">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                        <Box>
                            <Title order={3} mb="md">Merca Finds</Title>
                            <Text size="sm">by Mercadoria de Argila</Text>
                            <Text size="sm" mt="md">
                                The ultimate one-stop platform for discovering a curated selection of pre-owned and brand-new items
                            </Text>
                            <Image src={logo} alt="Merca Finds Logo" width={100} mt="md" />
                        </Box>

                        <Box>
                            <Title order={4} mb="md">Support</Title>
                            <Text size="sm">123 Market Street</Text>
                            <Text size="sm">San Francisco, CA 94103</Text>
                        </Box>

                        <Box>
                            <Title order={4} mb="md">Contact</Title>
                            <Text size="sm">exclusive@gmail.com</Text>
                            <Text size="sm">+1 (555) 123-4567</Text>
                        </Box>

                        <Box>
                            <Title order={4} mb="md">Follow Us</Title>
                            <Flex gap="md">
                                <Anchor href="#" target="_blank">Instagram</Anchor>
                                <Anchor href="#" target="_blank">Twitter</Anchor>
                                <Anchor href="#" target="_blank">Facebook</Anchor>
                            </Flex>
                        </Box>
                    </SimpleGrid>

                    <Divider my="md" />

                    <Text ta="center" size="sm" c="dimmed">
                        © 2025 Merca Finds. All rights reserved.
                    </Text>
                </Container>
            </Footer>
        </Box>
    );
}
