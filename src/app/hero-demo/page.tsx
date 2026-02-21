export default function HeroDemoPage() {
  return (
    <div className="flex flex-col">
      {/* Navigation */}
      <div className="navbar bg-base-300 sticky top-0 z-50">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">
            ← Back to Home
          </a>
        </div>
        <div className="flex-none">
          <span className="text-sm opacity-70">DaisyUI Hero Examples</span>
        </div>
      </div>

      {/* Example 1: Centered Hero */}
      <section className="border-b-8 border-base-300">
        <div className="p-4 bg-base-300">
          <h2 className="text-2xl font-bold">1. Centered Hero</h2>
          <p className="text-sm opacity-70">Simple centered content with heading, text, and button</p>
        </div>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Example 2: Hero with Figure */}
      <section className="border-b-8 border-base-300">
        <div className="p-4 bg-base-300">
          <h2 className="text-2xl font-bold">2. Hero with Figure</h2>
          <p className="text-sm opacity-70">Content on the left, image on the right</p>
        </div>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row">
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              alt="Hero"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">Box Office News!</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Example 3: Hero with Figure (Reverse Order) */}
      <section className="border-b-8 border-base-300">
        <div className="p-4 bg-base-300">
          <h2 className="text-2xl font-bold">3. Hero with Figure (Reverse Order)</h2>
          <p className="text-sm opacity-70">Image on the left, content on the right</p>
        </div>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <img
              src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
              alt="Hero"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div>
              <h1 className="text-5xl font-bold">Box Office News!</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Example 4: Hero with Form */}
      <section className="border-b-8 border-base-300">
        <div className="p-4 bg-base-300">
          <h2 className="text-2xl font-bold">4. Hero with Form</h2>
          <p className="text-sm opacity-70">Login/signup form with promotional text</p>
        </div>
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-row-reverse">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold">Login now!</h1>
              <p className="py-6">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
            </div>
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
              <div className="card-body">
                <fieldset className="fieldset">
                  <label className="label">Email</label>
                  <input type="email" className="input" placeholder="Email" />
                  <label className="label">Password</label>
                  <input type="password" className="input" placeholder="Password" />
                  <div><a className="link link-hover">Forgot password?</a></div>
                  <button className="btn btn-neutral mt-4">Login</button>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Example 5: Hero with Overlay Image */}
      <section className="border-b-8 border-base-300">
        <div className="p-4 bg-base-300">
          <h2 className="text-2xl font-bold">5. Hero with Overlay Image</h2>
          <p className="text-sm opacity-70">Full-width background image with centered content overlay</p>
        </div>
        <div
          className="hero min-h-screen"
          style={{
            backgroundImage: 'url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)',
          }}
        >
          <div className="hero-overlay"></div>
          <div className="hero-content text-neutral-content text-center">
            <div className="max-w-md">
              <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
              <p className="mb-5">
                Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                quasi. In deleniti eaque aut repudiandae et a id nisi.
              </p>
              <button className="btn btn-primary">Get Started</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
