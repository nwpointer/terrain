import useStore from '@/helpers/store'
import dynamic from 'next/dynamic'

const Debug = dynamic(() => import('@/components/canvas/Debug'), {
  ssr: false,
})

const Page = ({ title }) => {
  useStore.setState({ title })
  return (
    <>
      <Debug r3f />
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
