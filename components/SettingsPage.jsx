import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import toast, { Toaster } from 'react-hot-toast';
import { authStore, update, getFileUrl } from '@/lib/pocketbase';
import Image from 'next/image';

export default function SettingsPage() {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [created, setCreated] = useState('');
  const [updated, setUpdated] = useState('');

  useEffect(() => {
    if (authStore.model) {
      setUsername(authStore.model.username);
      setName(authStore.model.name || '');
      setEmail(authStore.model.email);
      setAvatarUrl(authStore.model.avatar ? getFileUrl(authStore.model, authStore.model.avatar) : '');
      setCreated(new Date(authStore.model.created).toLocaleString());
      setUpdated(new Date(authStore.model.updated).toLocaleString());
    }
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files[0]) {
      setAvatar(e.target.files[0]);
      setAvatarUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const updatePromise = new Promise(async (resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('username', username);
        formData.append('name', name);
        formData.append('email', email);
        if (avatar) {
          formData.append('avatar', avatar);
        }

        const record = await update('users', authStore.model.id, formData);

        authStore.save(authStore.token, record);

        resolve('Profile updated successfully!');
      } catch (error) {
        if (error.data) {
          const errorData = error?.data?.data;
          if (errorData && errorData.username) {
            reject(`Invalid username: ${errorData?.username?.message}`);
          } else if (errorData && errorData.name) {
            reject(`Invalid name: ${errorData?.name?.message}`);
          } else if (errorData && errorData.email) {
            reject(`Invalid email: ${errorData?.email?.message}`);
          }
          else {
            reject('Something went wrong while processing your request.');
          }
        } else {
          reject('Failed to update profile. Please try again.');
        }
      }
    });

    toast.promise(updatePromise, {
      loading: 'Updating profile...',
      success: (message) => message,
      error: (message) => message,
    });
  };

  return (
    <div className="flex flex-col items-center">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold mb-8 text-[#265AFF]">Settings</h2>
      <form onSubmit={handleUpdateProfile} className="space-y-6 w-full max-w-md">
        <div className="flex flex-col items-center mb-4">
          <Avatar className="w-24 h-24 mb-2 relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={name || username}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <Input
            type="file"
            onChange={handleAvatarChange}
            accept="image/*"
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="username" className="block mb-2 font-medium">Username</label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="name" className="block mb-2 font-medium">Name</label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">Email (cannot be changed)</label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}

            className="w-full bg-gray-100"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Account Created</label>
          <p className="text-gray-600">{created}</p>
        </div>
        <div>
          <label className="block mb-2 font-medium">Last Updated</label>
          <p className="text-gray-600">{updated}</p>
        </div>
        <Button type="submit" className="w-full bg-[#265AFF] hover:bg-[#1e4cd1] text-white">
          Update Profile
        </Button>
      </form>
    </div>
  );
}