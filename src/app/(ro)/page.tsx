import HomePage, { homeMetadata } from '@/components/sections/HomePage'

export const generateMetadata = () => homeMetadata('ro')

export default function Page() {
  return <HomePage lang="ro" />
}
