import { useState } from 'react'
import { Button } from '@/core/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/core/components/ui/dialog'
import { Input } from '@/core/components/ui/input'
import { Label } from '@/core/components/ui/label'
import { useCreateUserMutation, useGetRolesQuery } from '@/core/store'
import { useSimpleToast } from '@/core/hooks/useSimpleToast'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CreateUserForm {
  email: string
  firstName: string
  lastName: string
  password: string
  role: string
  department: string
  jobTitle: string
}


const DEPARTMENTS = [
  'Operations',
  'Development',
  'Security',
  'Finance',
  'Human Resources',
  'Marketing',
  'Customer Support'
]

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const [formData, setFormData] = useState<CreateUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    role: '',
    department: '',
    jobTitle: ''
  })
  const [errors, setErrors] = useState<Partial<CreateUserForm>>({})

  const [createUser, { isLoading }] = useCreateUserMutation()
  const { data: roles = [], isLoading: rolesLoading } = useGetRolesQuery()
  const toast = useSimpleToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Partial<CreateUserForm> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.password) newErrors.password = 'Password is required'
    if (!formData.role) newErrors.role = 'Role is required'
    if (!formData.department) newErrors.department = 'Department is required'
    if (!formData.jobTitle) newErrors.jobTitle = 'Job title is required'

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      const userData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        jobTitle: formData.jobTitle
      }

      console.log('Creating user with data:', userData)

      await createUser(userData).unwrap()

      toast.success('User created successfully')
      onOpenChange(false)

      // Reset form
      setFormData({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
        department: '',
        jobTitle: ''
      })
      setErrors({})
    } catch (error: any) {
      console.error('Create user error:', error)
      toast.error(error?.data?.message || 'Failed to create user')
    }
  }

  const handleChange = (field: keyof CreateUserForm) => (
    value: string | React.ChangeEvent<HTMLInputElement>
  ) => {
    const newValue = typeof value === 'string' ? value : value.target.value
    setFormData(prev => ({ ...prev, [field]: newValue }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new admin user account. They will receive an email with setup instructions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={handleChange('firstName')}
                placeholder="Enter first name"
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={handleChange('lastName')}
                placeholder="Enter last name"
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="Enter email address"
              className={errors.email ? 'border-destructive' : ''}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Temporary Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="Enter temporary password"
              className={errors.password ? 'border-destructive' : ''}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleChange('department')(e.target.value)}
                className={`w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                  errors.department ? 'border-destructive' : ''
                }`}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange('jobTitle')}
                placeholder="Enter job title"
                className={errors.jobTitle ? 'border-destructive' : ''}
              />
              {errors.jobTitle && (
                <p className="text-sm text-destructive">{errors.jobTitle}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => handleChange('role')(e.target.value)}
              disabled={rolesLoading}
              className={`w-full px-3 py-2 border border-input bg-background rounded-md text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent ${
                errors.role ? 'border-destructive' : ''
              }`}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}