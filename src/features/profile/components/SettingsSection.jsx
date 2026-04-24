import { Button } from '../../../shared/ui/button'
import { Card, CardContent } from '../../../shared/ui/card'
import { Input } from '../../../shared/ui/input'

export function SettingsSection({ profileForm, updateProfileField, handleSaveProfile, profileSaveLoading }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-8">
        <h2 className="mb-2 text-2xl font-semibold text-gray-900">Account Settings</h2>
        <p className="mb-6 text-sm text-gray-500">This screen currently saves your name and phone number to the live customer profile.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input value={profileForm.firstName} onChange={(e) => updateProfileField('firstName', e.target.value)} placeholder="First name" />
          <Input value={profileForm.lastName} onChange={(e) => updateProfileField('lastName', e.target.value)} placeholder="Last name" />
          <Input value={profileForm.email} readOnly placeholder="Email" className="cursor-not-allowed opacity-70" />
          <Input value={profileForm.phone} onChange={(e) => updateProfileField('phone', e.target.value)} placeholder="Phone" />
          <Input value={profileForm.residenceCity} readOnly placeholder="City / Emirate" className="cursor-not-allowed opacity-70" />
          <Input value={profileForm.residenceArea} readOnly placeholder="Area" className="cursor-not-allowed opacity-70" />
        </div>
        <div className="pt-6">
          <Button onClick={handleSaveProfile} disabled={profileSaveLoading} className="bg-gradient-to-r from-rose-500 to-pink-500">
            {profileSaveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
