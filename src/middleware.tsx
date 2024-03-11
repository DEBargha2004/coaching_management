import { authMiddleware } from '@clerk/nextjs'

export default authMiddleware({
  // afterAuth (auth, req, evt) {
  //   if (
  //     auth.user?.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL
  //   ) {
  //     NextResponse.next()
  //   } else {
  //     NextResponse.redirect(new URL('/unauthorized', req.url))
  //   }
  // }
})

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)']
}
