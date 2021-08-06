import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'

const Movement = dynamic(
  () => import('@/components/canvas/MovementOnTerrainFallback'),
  {
    ssr: false,
  }
)

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <Movement r3f />
    </>
  )
}

export default Page

export async function getStaticProps() {
  return {
    props: {
      title: 'Index',
    },
  }
}
