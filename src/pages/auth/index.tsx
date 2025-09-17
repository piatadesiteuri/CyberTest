'use client'

import React, { useState } from 'react'
import { Box, Container, VStack, Image, useColorModeValue } from '@chakra-ui/react'
import LoginForm from '@/components/auth/forms/LoginForm'
import RegisterForm from '@/components/auth/forms/RegisterForm'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const bgGradient = useColorModeValue(
    'linear(to-br, brand.50, brand.100)',
    'linear(to-br, gray.900, gray.800)'
  )

  return (
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          {/* Logo and Header */}
          <VStack spacing={4}>
            <Image
              src="/logo.png"
              alt="CyberTest Logo"
              boxSize="80px"
              objectFit="contain"
            />
            <Box textAlign="center">
              <Box
                fontSize="4xl"
                fontWeight="bold"
                bgGradient="linear(to-r, brand.500, brand.700)"
                bgClip="text"
              >
                CyberTest
              </Box>
              <Box fontSize="lg" color="gray.600" mt={2}>
                All-in-One Cybersecurity Training Platform
              </Box>
            </Box>
          </VStack>

          {/* Auth Form */}
          <Box
            bg="white"
            p={8}
            rounded="xl"
            shadow="xl"
            w="full"
            maxW="md"
            border="1px"
            borderColor="gray.200"
          >
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </Box>

          {/* Footer */}
          <Box textAlign="center" color="gray.600" fontSize="sm">
            <Text>
              © 2025 CyberTest. All rights reserved.
            </Text>
            <Text mt={1}>
              Empowering organizations with cybersecurity awareness.
            </Text>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
