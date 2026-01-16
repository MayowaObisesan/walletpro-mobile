import { Button } from '@src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu';
import { Text } from '@src/components/ui/text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {Avatar, AvatarFallback, AvatarImage} from "@src/components/ui/avatar";
import React from "react";
import {router} from "expo-router";
import {useLogout} from "@account-kit/react-native";

export function ProfileDropDown() {
  const { logout } = useLogout();
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 4,
    right: 4,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        {/*<Button size={'icon'} variant="ghost">*/}
          <Avatar
            alt="Zach Nugent's Avatar"
            className={'size-12'}
          >
            <AvatarImage source={{ uri: '' }} />
            <AvatarFallback>
              <Text>BM</Text>
            </AvatarFallback>
          </Avatar>
        {/*</Button>*/}
      </DropdownMenuTrigger>
      <DropdownMenuContent insets={contentInsets} sideOffset={2} className="w-56 px-2 mt-1 bg-card border-hairline border-muted-foreground/20 rounded-2xl" align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>Profile</Text>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Billing</Text>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Settings</Text>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Keyboard shortcuts</Text>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Text>Team</Text>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Text>Invite users</Text>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Text>Email</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Text>Message</Text>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Text>More...</Text>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuItem>
            <Text>New Team</Text>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Text>GitHub</Text>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Text>Support</Text>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <Text>API</Text>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={() => {
          logout();
          return router.replace("/sign-in");
        }}>
          <Text>Log out</Text>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
