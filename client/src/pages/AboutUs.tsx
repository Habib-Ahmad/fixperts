import { Card, CardContent } from '../components';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

const AboutUsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-center">About Fixperts</h1>
        <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto">
          Fixperts is your trusted platform for hiring skilled, local service providers—fast.
          Whether it’s plumbing, electrical work, cleaning, or general maintenance, we make it
          simple for you to connect with vetted professionals in your area.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">Why We Exist</h2>
            <p className="text-muted-foreground">
              In many communities, reliable service professionals are either hard to find or
              difficult to trust. We started Fixperts to bridge that gap — making it easier for
              individuals to access quality, on-demand home services while giving professionals a
              reliable platform to grow their business.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">Our Mission</h2>
            <p className="text-muted-foreground">
              To create a trusted ecosystem where users can confidently book local services and
              service providers can focus on what they do best — delivering excellent work.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">What Makes Us Different</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Verified professionals and transparent reviews</li>
              <li>Fast, intuitive booking with emergency service options</li>
              <li>Fair pricing and direct communication with providers</li>
              <li>Location-based matching and real-time updates</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-2xl font-semibold">Who We Serve</h2>
            <p className="text-muted-foreground">Fixperts is built for:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Everyday users needing quick and trusted help</li>
              <li>Vendors and independent professionals seeking exposure</li>
              <li>Landlords and offices managing property maintenance</li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="text-center space-y-4">
        <h2 className="text-2xl font-semibold">Join Our Growing Community</h2>
        <p className="text-muted-foreground">
          Whether you’re looking to hire or get hired, Fixperts is here to support you.
        </p>
        <Button onClick={() => navigate('/signup')}>Get Started</Button>
      </section>
    </div>
  );
};

export default AboutUsPage;
