import { Link } from "react-router-dom";
import { TESTIMONIALS } from "@/Pages/Landing"; // adjust import path if needed

import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          What Our Users Say
        </h2>
        <div className="overflow-hidden relative">
          <div className="flex animate-scroll whitespace-nowrap">
            {TESTIMONIALS.map((t) => (
              <Link
                key={t.id}
                to="#"
                className="inline-block mx-4 w-80 no-underline"
              >
                <Card className="bg-slate-800 border-slate-700 hover:bg-slate-700 transition-colors h-full">
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center h-full">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-16 h-16 rounded-full mb-4 object-cover"
                    />
                    <p className="text-slate-300 mb-2 whitespace-normal italic">
                      "{t.text}"
                    </p>
                    <div className="mt-auto">
                      <p className="font-semibold text-white">{t.name}</p>
                      <p className="text-sm text-slate-400">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
