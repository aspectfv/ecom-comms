{/* Footer */ }
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
        </Box >
    );

