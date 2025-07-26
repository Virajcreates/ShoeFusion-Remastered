import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertTriangleIcon } from "lucide-react"

export default function InstallationGuidePage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">ShoeFusion Installation Guide</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Follow this step-by-step guide to set up and run the ShoeFusion application locally on your machine.
      </p>

      <Tabs defaultValue="standard" className="mb-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Installation</TabsTrigger>
          <TabsTrigger value="docker">Docker Installation</TabsTrigger>
        </TabsList>

        <TabsContent value="standard">
          <Card>
            <CardHeader>
              <CardTitle>Standard Installation</CardTitle>
              <CardDescription>Follow these steps to install and run ShoeFusion without Docker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Node.js 18.x or higher</li>
                  <li>npm 9.x or higher</li>
                  <li>Git (optional, for cloning the repository)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Clone or Download the Repository</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  git clone https://github.com/yourusername/shoe-fusion.git
                  <br />
                  cd shoe-fusion
                </div>
                <p className="text-sm text-muted-foreground">
                  Alternatively, download the ZIP file and extract it to your preferred location.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Install Dependencies</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">npm install</div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. Set Up Environment Variables</h3>
                <p>
                  Create a <code>.env.local</code> file in the root directory with the following variables:
                </p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
                  <br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
                  <br />
                  SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
                  <br />
                  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
                  <br />
                  STRIPE_SECRET_KEY=your_stripe_secret_key
                  <br />
                  STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">5. Initialize the Database</h3>
                <p>Start the development server and initialize the database:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">npm run dev</div>
                <p>
                  Then visit: <code>http://localhost:3000/admin/database</code> and follow the instructions.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">6. Start Using the Application</h3>
                <p>
                  The app should now be running at <code>http://localhost:3000</code>
                </p>
                <p>You can create an account, customize shoes, and place orders.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docker">
          <Card>
            <CardHeader>
              <CardTitle>Docker Installation</CardTitle>
              <CardDescription>Follow these steps to install and run ShoeFusion using Docker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Docker installed on your machine</li>
                  <li>Docker Compose (optional, for easier setup)</li>
                  <li>Git (optional, for cloning the repository)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Clone or Download the Repository</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  git clone https://github.com/yourusername/shoe-fusion.git
                  <br />
                  cd shoe-fusion
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Set Up Environment Variables</h3>
                <p>
                  Create a <code>.env</code> file in the root directory with the same variables as in the standard
                  installation.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. Build and Run with Docker</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">docker-compose up -d</div>
                <p>Or if you're not using Docker Compose:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  docker build -t shoe-fusion .<br />
                  docker run -p 3000:3000 --env-file .env shoe-fusion
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">5. Initialize the Database</h3>
                <p>
                  Visit: <code>http://localhost:3000/admin/database</code> and follow the instructions.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">6. Start Using the Application</h3>
                <p>
                  The app should now be running at <code>http://localhost:3000</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <h2 className="text-2xl font-bold mb-4">Troubleshooting Common Issues</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              3D Model Not Appearing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If the 3D shoe model is not rendering:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Make sure your browser supports WebGL. Try using Chrome or Firefox.</li>
              <li>Check your browser console for any errors related to 3D rendering.</li>
              <li>Try disabling any ad blockers or privacy extensions that might be interfering.</li>
              <li>Ensure your graphics drivers are up to date.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Hydration Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If you see hydration errors in the console:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Clear your browser cache and reload the page.</li>
              <li>Try using incognito/private browsing mode.</li>
              <li>Make sure you're using the latest version of the code.</li>
              <li>Check that your Node.js version matches the requirements.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Payment Processing Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If payments are not processing correctly:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Verify that your Stripe API keys are correctly set up in the environment variables.</li>
              <li>Ensure the webhook secret is properly configured.</li>
              <li>Check that your Stripe account is in test mode for development.</li>
              <li>Use Stripe's test card numbers for testing (e.g., 4242 4242 4242 4242).</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Database Connection Errors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If you're experiencing database connection issues:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Check your Supabase credentials in the environment variables.</li>
              <li>Ensure the database is properly initialized via the admin page.</li>
              <li>Verify that your IP is allowed in Supabase's security settings.</li>
              <li>Check if your Supabase project is active and not in maintenance mode.</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Deployment Note</AlertTitle>
        <AlertDescription>
          For production deployment, make sure to set up proper environment variables in your hosting platform and
          configure the Stripe webhook endpoint correctly.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <p className="mb-4">Need more help? Check out our resources:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/faq" className="text-primary hover:underline">
            FAQ
          </Link>
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
          <a
            href="https://github.com/yourusername/shoe-fusion/issues"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Issues
          </a>
        </div>
      </div>
    </div>
  )
}
