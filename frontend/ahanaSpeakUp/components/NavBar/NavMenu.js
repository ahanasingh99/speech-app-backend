'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
// import { Icons } from '@/components/icons'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  ListItem,
} from '@/components/ui/navigation-menu'

export default function NavMenu(props) {
  const { courseData, navSubject } = props

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>{navSubject}</NavigationMenuTrigger>
          <NavigationMenuContent className="relative z-[100] bg-white shadow-lg rounded-lg p-4">
            <ul className={`grid gap-3 p-3 md:grid-cols-1`}>
              {courseData.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                ></ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
