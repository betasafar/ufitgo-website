"use server"

import { revalidatePath } from "next/cache"

export async function revalidatePackages() {
  revalidatePath('/')
  revalidatePath('/packages')
}
