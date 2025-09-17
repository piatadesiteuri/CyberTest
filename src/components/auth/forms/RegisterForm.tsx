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
  Select,
  Checkbox,
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { useAuth } from '@/contexts/AuthContext'
import { RegisterRequest, UserRole } from '@/types/auth'

interface RegisterFormProps {
  onSwitchToLogin: () => void
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    department: '',
    role: UserRole.EMPLOYEE,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  
  const { register } = useAuth()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!acceptTerms) {
      toast({
        title: 'Terms required',
        description: 'Please accept the terms and conditions.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      await register(formData)
      toast({
        title: 'Registration successful!',
        description: 'Welcome to CyberTest. Your account has been created.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.message || 'An error occurred during registration.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Box w="full" maxW="md" mx="auto">
      <VStack spacing={6} align="stretch">
        <Box textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" color="harmony.dark">
            Join CyberTest
          </Text>
          <Text color="gray.600" mt={2}>
            Create your account to get started
          </Text>
        </Box>

        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <HStack spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel>First Name</FormLabel>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter your first name"
                  variant="filled"
                  size="lg"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter your last name"
                  variant="filled"
                  size="lg"
                />
              </FormControl>
            </HStack>

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
              <FormLabel>Department</FormLabel>
              <Select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="Select your department"
                variant="filled"
                size="lg"
              >
                <option value="IT">IT</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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

            <FormControl isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  variant="filled"
                  size="lg"
                />
                <InputRightElement h="full">
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Checkbox
              isChecked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              colorScheme="brand"
            >
              <Text fontSize="sm">
                I agree to the{' '}
                <Link color="brand.500" href="/terms">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link color="brand.500" href="/privacy">
                  Privacy Policy
                </Link>
              </Text>
            </Checkbox>

            <Text fontSize="sm" color="gray.600" textAlign="center">
              Already have an account?{' '}
              <Link color="brand.500" onClick={onSwitchToLogin}>
                Sign in
              </Link>
            </Text>

            <Button
              type="submit"
              colorScheme="brand"
              size="lg"
              w="full"
              isLoading={isLoading}
              loadingText="Creating account..."
            >
              Create Account
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
