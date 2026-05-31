"use client";

import ContinueUsingGoogleButton from '@/components/ContinueUsingGoogleButton';
import { Button } from '@/components/ui/button';
import { Coffee, File, LayoutDashboard } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React from 'react'

const HomePageButtons = () => {
  const { data: session } = useSession();

  return (
    <div className="grid justify-center gap-2">
      <div className="flex gap-2 justify-center">
        {session ? (
          <Button asChild>
            <Link href="/dashboard">
              <LayoutDashboard />
              Dashboard
            </Link>
          </Button>
        ) : (
          <ContinueUsingGoogleButton />
        )}
        <Button variant="ghost" asChild>
          <Link href="https://buymeacoffee.com/michaelgatmaitan">
            <Coffee />
            Buy me a coffee
          </Link>
        </Button>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" className='w-fit' asChild>
          <Link href="/docs">
            <File />
            Get started
          </Link>
        </Button>
      </div>
    </div>
  )
}

export default HomePageButtons