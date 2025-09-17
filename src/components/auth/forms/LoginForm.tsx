'use client'

import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Text,
  Link,
  useToast,
  Divider,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '@/contexts/AuthContext'
import { LoginRequest } from '@/types/auth'

interface LoginFormProps {
  onSwitchToRegister: () => void
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(formData)
      toast({
        title: 'Login successful!',
        description: 'Welcome back to CyberTest.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.message || 'An error occurred during login.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <Box w="full" maxW="md" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="harmony.dark">
            Welcome Back
          </Text>
          <Text color="gray.600" mt={2}>
            Sign in to your CyberTest account
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                variant="filled"
                size="lg"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  variant="filled"
                  size="lg"
                />
                <InputRightElement h="full">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <HStack w="full" justify="space-between">
              <Text fontSize="sm" color="gray.600">
                Don't have an account?{' '}
                <Link color="brand.500" onClick={onSwitchToRegister}>
                  Sign up
                </Link>
              </Text>
              <Link color="brand.500" fontSize="sm">
                Forgot password?
              </Link>
            </HStack>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Signing in..."
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Divider />

        <Box textAlign="center">
          <Text fontSize="sm" color="gray.600">
            Continue with
          </Text>
          <HStack justify="center" mt={2} spacing={4}>
            <Button variant="outline" size="sm">
              Google
            </Button>
            <Button variant="outline" size="sm">
              Microsoft
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  )
}
