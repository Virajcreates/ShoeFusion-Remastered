import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangleIcon, CheckCircleIcon, ServerIcon, GlobeIcon } from "lucide-react"

export default function DeploymentGuidePage() {
  return (
    <div className="container py-10">
      <h1 className="text-4xl font-bold mb-6">ShoeFusion Deployment Guide</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Follow this comprehensive guide to deploy the ShoeFusion application to production environments.
      </p>

      <Tabs defaultValue="vercel" className="mb-10">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vercel">Vercel</TabsTrigger>
          <TabsTrigger value="netlify">Netlify</TabsTrigger>
          <TabsTrigger value="custom">Custom Server</TabsTrigger>
        </TabsList>

        <TabsContent value="vercel">
          <Card>
            <CardHeader>
              <CardTitle>Deploying to Vercel</CardTitle>
              <CardDescription>
                The easiest way to deploy ShoeFusion is using Vercel, the platform built by the creators of Next.js
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>A GitHub, GitLab, or Bitbucket account with your ShoeFusion repository</li>
                  <li>A Vercel account (free tier is available)</li>
                  <li>Your Supabase and Stripe account details</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Connect Your Repository</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Log in to your Vercel account</li>
                  <li>Click "Add New" and select "Project"</li>
                  <li>Import your ShoeFusion repository from GitHub, GitLab, or Bitbucket</li>
                  <li>Vercel will automatically detect that it's a Next.js project</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Configure Environment Variables</h3>
                <p>Add the following environment variables in the Vercel project settings:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                  <li>SUPABASE_SERVICE_ROLE_KEY</li>
                  <li>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</li>
                  <li>STRIPE_SECRET_KEY</li>
                  <li>STRIPE_WEBHOOK_SECRET</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. Deploy Your Application</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Click "Deploy" and wait for the build to complete</li>
                  <li>Vercel will provide you with a deployment URL (e.g., shoe-fusion.vercel.app)</li>
                  <li>Visit the URL to verify that your application is working correctly</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">5. Set Up Stripe Webhook</h3>
                <p>Configure your Stripe webhook to point to your deployed application:</p>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Go to the Stripe Dashboard &gt; Developers &gt; Webhooks</li>
                  <li>
                    Add an endpoint with the URL: <code>https://your-domain.vercel.app/api/webhook</code>
                  </li>
                  <li>
                    Select the events: <code>checkout.session.completed</code>, <code>payment_intent.succeeded</code>,
                    and <code>payment_intent.payment_failed</code>
                  </li>
                  <li>
                    Copy the webhook signing secret and add it to your Vercel environment variables as{" "}
                    <code>STRIPE_WEBHOOK_SECRET</code>
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">6. Initialize the Database</h3>
                <p>
                  Visit <code>https://your-domain.vercel.app/admin/database</code> to initialize the database tables.
                </p>
              </div>

              <Alert className="mt-4">
                <CheckCircleIcon className="h-4 w-4" />
                <AlertTitle>Automatic Deployments</AlertTitle>
                <AlertDescription>
                  Vercel will automatically deploy new versions when you push changes to your repository.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="netlify">
          <Card>
            <CardHeader>
              <CardTitle>Deploying to Netlify</CardTitle>
              <CardDescription>Netlify is another great platform for deploying Next.js applications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>A GitHub, GitLab, or Bitbucket account with your ShoeFusion repository</li>
                  <li>A Netlify account (free tier is available)</li>
                  <li>Your Supabase and Stripe account details</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Connect Your Repository</h3>
                <ol className="list-decimal pl-6 space-y-1">
                  <li>Log in to your Netlify account</li>
                  <li>Click "New site from Git"</li>
                  <li>Select your Git provider and authorize Netlify</li>
                  <li>Choose your ShoeFusion repository</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Configure Build Settings</h3>
                <p>Set the following build settings:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Build command: <code>npm run build</code>
                  </li>
                  <li>
                    Publish directory: <code>.next</code>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. Configure Environment Variables</h3>
                <p>Add the same environment variables as listed in the Vercel deployment section.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">5. Deploy Your Application</h3>
                <p>Click "Deploy site" and wait for the build to complete.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">6. Set Up Stripe Webhook</h3>
                <p>Configure your Stripe webhook to point to your Netlify domain.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">7. Initialize the Database</h3>
                <p>Visit your Netlify domain's admin/database page to initialize the database tables.</p>
              </div>

              <Alert className="mt-4">
                <AlertTriangleIcon className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Next.js on Netlify</AlertTitle>
                <AlertDescription>
                  Make sure to install the Netlify Next.js plugin for optimal performance.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="custom">
          <Card>
            <CardHeader>
              <CardTitle>Deploying to a Custom Server</CardTitle>
              <CardDescription>For more control, you can deploy ShoeFusion to your own server</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">1. Prerequisites</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>A server with Node.js 18.x or higher installed</li>
                  <li>A domain name pointing to your server</li>
                  <li>SSH access to your server</li>
                  <li>PM2 or similar process manager (recommended)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">2. Build the Application</h3>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">npm run build</div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">3. Set Up Environment Variables</h3>
                <p>
                  Create a <code>.env.production</code> file with all the required environment variables.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">4. Start the Application</h3>
                <p>Using PM2:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  pm2 start npm --name "shoe-fusion" -- start
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">5. Set Up Nginx as a Reverse Proxy</h3>
                <p>Create an Nginx configuration file:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm overflow-x-auto">
                  server {"{"}
                  <br /> listen 80;
                  <br /> server_name your-domain.com;
                  <br />
                  <br /> location / {"{"}
                  <br /> proxy_pass http://localhost:3000;
                  <br /> proxy_http_version 1.1;
                  <br /> proxy_set_header Upgrade $http_upgrade;
                  <br /> proxy_set_header Connection 'upgrade';
                  <br /> proxy_set_header Host $host;
                  <br /> proxy_cache_bypass $http_upgrade;
                  <br /> {"}"}
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">6. Set Up SSL with Let's Encrypt</h3>
                <p>Install Certbot and obtain an SSL certificate:</p>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">certbot --nginx -d your-domain.com</div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">7. Set Up Stripe Webhook</h3>
                <p>Configure your Stripe webhook to point to your domain.</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold">8. Initialize the Database</h3>
                <p>Visit your domain's admin/database page to initialize the database tables.</p>
              </div>

              <Alert className="mt-4">
                <ServerIcon className="h-4 w-4" />
                <AlertTitle>Server Maintenance</AlertTitle>
                <AlertDescription>
                  Remember to set up regular backups and keep your server updated with security patches.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <h2 className="text-2xl font-bold mb-4">Common Deployment Issues</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Build Failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If your build is failing:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Check the build logs for specific error messages</li>
              <li>Ensure all dependencies are properly installed</li>
              <li>Verify that your Node.js version is compatible</li>
              <li>Check for any syntax errors in your code</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              API Routes Not Working
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If your API routes are not functioning:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ensure environment variables are correctly set</li>
              <li>Check CORS settings if applicable</li>
              <li>Verify that your Supabase and Stripe credentials are correct</li>
              <li>Look for any server-side errors in the logs</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              3D Models Not Loading
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If 3D models are not loading in production:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ensure all model files are properly included in the build</li>
              <li>Check that the paths to the models are correct</li>
              <li>Verify that the models are being served with the correct MIME types</li>
              <li>Add proper error handling and fallbacks for 3D model loading</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
              Stripe Webhook Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">If Stripe webhooks are not working:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Verify that the webhook URL is correctly configured in Stripe</li>
              <li>Ensure the webhook secret is correctly set in your environment variables</li>
              <li>Check that the webhook endpoint is publicly accessible</li>
              <li>Look for any errors in the Stripe webhook logs</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Alert className="mb-6">
        <GlobeIcon className="h-4 w-4" />
        <AlertTitle>Custom Domain</AlertTitle>
        <AlertDescription>
          For a professional look, consider setting up a custom domain for your ShoeFusion application. Both Vercel and
          Netlify make it easy to configure custom domains.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <p className="mb-4">Need more help with deployment? Check out these resources:</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/installation-guide" className="text-primary hover:underline">
            Installation Guide
          </Link>
          <Link href="/contact" className="text-primary hover:underline">
            Contact Support
          </Link>
          <a
            href="https://nextjs.org/docs/deployment"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Next.js Deployment Docs
          </a>
        </div>
      </div>
    </div>
  )
}
