import { ArrowIcon, Button } from "@/components/button";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <main id="main-content" className="flex flex-1 items-center py-40">
        <div className="container-x">
          <div className="mx-auto max-w-xl text-center">
            <h1 className="display text-4xl text-gradient sm:text-6xl">
              This page is not on the map.
            </h1>
            <p className="mt-6 text-base leading-8 text-muted">
              The address you followed does not exist any more. Head back to the start, or tell us
              what you were looking for.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Button href="/">
                Back to home
                <ArrowIcon />
              </Button>
              <Button href="/contact">Contact us</Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
