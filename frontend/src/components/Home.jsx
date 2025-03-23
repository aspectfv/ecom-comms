import { useState, useEffect } from 'react';
import {
    Container,
    Title,
    Text,
    Grid,
    Card,
    Image,
    Group,
    Box,
    SimpleGrid,
    Divider,
    Anchor,
    Space,
    Tabs,
    ActionIcon,
    Burger,
    Drawer,
    ScrollArea,
    Button,
    HoverCard,
    Center,
    ThemeIcon,
    UnstyledButton
} from '@mantine/core';
import {
    IconBrandInstagram,
    IconBrandTwitter,
    IconBrandFacebook,
    IconChevronDown,
    IconShoppingCart,
    IconHeart,
    IconUser
} from '@tabler/icons-react';
import { Link, useLoaderData } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';

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

    // For the header
    const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);

    return (
        <Box>
            {/* Header */}
            <Box component="header" height={60} px="md" style={{
                borderBottom: '1px solid #e9ecef',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
                backgroundColor: 'white'
            }}>
                <Group h="100%" justify="space-between" align="center">
                    <Group>
                        <Title order={2}>Merca Finds</Title>
                    </Group>

                    <Group h="100%" gap={0} visibleFrom="sm">
                        <Link to="/" style={{ textDecoration: 'none', padding: '0 15px' }}>
                            <Text>Home</Text>
                        </Link>
                        <Link to="/preloved" style={{ textDecoration: 'none', padding: '0 15px' }}>
                            <Text>Pre-loved</Text>
                        </Link>
                        <Link to="/brandnew" style={{ textDecoration: 'none', padding: '0 15px' }}>
                            <Text>Brand New</Text>
                        </Link>
                        <Link to="/about" style={{ textDecoration: 'none', padding: '0 15px' }}>
                            <Text>About</Text>
                        </Link>
                    </Group>

                    <Group visibleFrom="sm">
                        <ActionIcon variant="subtle">
                            <IconHeart size={20} />
                        </ActionIcon>
                        <ActionIcon variant="subtle">
                            <IconShoppingCart size={20} />
                        </ActionIcon>
                        <Anchor component={Link} to="/login">
                            <Button variant="subtle">Login</Button>
                        </Anchor>
                    </Group>

                    <Burger opened={drawerOpened} onClick={toggleDrawer} hiddenFrom="sm" />
                </Group>
            </Box>

            <Drawer
                opened={drawerOpened}
                onClose={closeDrawer}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="sm"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px)" mx="-md">
                    <Divider my="sm" />

                    <Link to="/" style={{ textDecoration: 'none', display: 'block', padding: '10px 15px' }}>
                        <Text>Home</Text>
                    </Link>
                    <Link to="/preloved" style={{ textDecoration: 'none', display: 'block', padding: '10px 15px' }}>
                        <Text>Pre-loved</Text>
                    </Link>
                    <Link to="/brandnew" style={{ textDecoration: 'none', display: 'block', padding: '10px 15px' }}>
                        <Text>Brand New</Text>
                    </Link>
                    <Link to="/about" style={{ textDecoration: 'none', display: 'block', padding: '10px 15px' }}>
                        <Text>About</Text>
                    </Link>

                    <Divider my="sm" />

                    <Group justify="center" grow pb="xl" px="md">
                        <Button variant="default" component={Link} to="/login">Log in</Button>
                        <Button component={Link} to="/signup">Sign up</Button>
                    </Group>
                </ScrollArea>
            </Drawer>

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
            <Box component="footer" py="xl" px="md" bg="gray.1">
                <Container size="xl">
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="xl">
                        <Box>
                            <Title order={3} mb="md">Merca Finds</Title>
                            <Text size="sm">by Mercadoria de Argila</Text>
                            <Text size="sm" mt="md">
                                The ultimate one-stop platform for discovering a curated selection of pre-owned and brand-new items
                            </Text>
                            <Image src="https://placehold.co/100x50?text=Logo" alt="Merca Finds Logo" width={100} mt="md" />
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
                            <Group gap="xs">
                                <ActionIcon size="lg" variant="default" radius="xl">
                                    <IconBrandInstagram size={18} stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon size="lg" variant="default" radius="xl">
                                    <IconBrandTwitter size={18} stroke={1.5} />
                                </ActionIcon>
                                <ActionIcon size="lg" variant="default" radius="xl">
                                    <IconBrandFacebook size={18} stroke={1.5} />
                                </ActionIcon>
                            </Group>
                        </Box>
                    </SimpleGrid>

                    <Divider my="md" />

                    <Text ta="center" size="sm" c="dimmed">
                        © 2025 Merca Finds. All rights reserved.
                    </Text>
                </Container>
            </Box>
        </Box>
    );
}
