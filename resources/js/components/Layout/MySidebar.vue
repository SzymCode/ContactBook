<template>
    <div class="fixed flex-column h-screen p-3 mySidebar z-100">
        <!--        <a href="/" class="mt-2 mb-4 mx-auto">-->
        <!--            <Avatar-->
        <!--                class="w-2rem h-2rem"-->
        <!--            />-->
        <!--        </a>-->

        <div class="flex flex-column justify-content-center w-3rem m-0 gap-3">
            <a
                href="/home"
                class="sidebarItem"
                v-tooltip.right="'Home'"
                :style="isCurrentUrl('/home') ? contactStyle : ''"
            >
                <i class="pi pi-home" />
            </a>
            <a
                href="/admin"
                class="sidebarItem"
                v-if="isAdmin"
                v-tooltip.right="'Admin Panel'"
                :style="isCurrentUrl('/admin') ? contactStyle : ''"
            >
                <i class="pi pi-users" />
            </a>
            <a
                href="/contacts"
                class="sidebarItem"
                v-tooltip.right="'Contacts'"
                :style="isCurrentUrl('/contacts') ? contactStyle : ''"
            >
                <i class="pi pi-user text-lg" />
            </a>
            <a
                href="#"
                class="sidebarItem disabledItem"
                v-tooltip.right="'Posts'"
            >
                <i class="pi pi-comment" />
            </a>
            <a
                href="#"
                class="sidebarItem disabledItem"
                v-tooltip.right="'Messages'"
            >
                <i class="pi pi-envelope" />
            </a>
            <a
                href="#"
                class="sidebarItem disabledItem"
                v-tooltip.right="'Tasks'"
            >
                <i class="pi pi-check-square" />
            </a>
            <a
                href="#"
                class="sidebarItem disabledItem"
                v-tooltip.right="'Calendar'"
            >
                <i class="pi pi pi-calendar" />
            </a>
            <a
                href="#"
                class="sidebarItem disabledItem"
                v-tooltip.right="'Money'"
            >
                <i class="pi pi pi-dollar" />
            </a>
            <a
                href="/activity-log"
                class="sidebarItem activitySidebarItem"
                v-tooltip.right="'Activity Log'"
                :style="isCurrentUrl('/activity-log') ? activityStyle : ''"
            >
                <i class="pi pi-clock" />
            </a>
        </div>
        <div class="flex flex-column mt-auto justify-content-center">
            <div class="flex flex-column gap-3">
                <a
                    href="#"
                    class="sidebarItem disabledItem"
                    v-tooltip.right="'Help'"
                >
                    <i class="pi pi-info-circle" />
                </a>
                <a
                    href="#"
                    class="sidebarItem disabledItem"
                    v-tooltip.right="'Settings'"
                >
                    <i class="pi pi-cog" />
                </a>
            </div>
            <hr class="border-top-1" />

            <div
                class="sidebarUser flex align-items-center gap-3 cursor-pointer p-2 border-round-xl"
                @click="openMenu($refs.menu, $event)"
            >
                <Avatar
                    icon="pi pi-user"
                    shape="circle"
                    class="w-2rem h-2rem"
                />
            </div>
            <Menu ref="menu" :model="userMenuItems" :popup="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue'

import { isCurrentUrl, openMenu, useColors } from '../../utils'
import { MenuItem } from 'primevue/menuitem'

const menu = ref()

defineProps<{
    isAdmin: Ref | null
    items: MenuItem[]
    userMenuItems: MenuItem[]
}>()

const { activityItemColors, contactItemColors } = useColors()

const activityStyle = {
    color: activityItemColors.primary,
    backgroundColor: activityItemColors.sidebarSelected,
}
const contactStyle = {
    color: contactItemColors.primary,
    backgroundColor: contactItemColors.sidebarSelected,
}
</script>
