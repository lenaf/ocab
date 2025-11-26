export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Our City Action Buffalo</h3>
            <p className="text-gray-400">Building people power in Buffalo through grassroots organizing.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/about" className="hover:text-white">About</a></li>
              <li><a href="/events" className="hover:text-white">Events</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <p className="text-gray-400">Follow us on social media for updates and events.</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Our City Action Buffalo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
