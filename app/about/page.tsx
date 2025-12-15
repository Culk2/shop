"use client";

// app/about/page.tsx

import { ShoppingBag, Sparkles, Globe, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-16">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            O nas – <span className="text-primary">StyleUp</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            StyleUp je sodobna spletna trgovina z oblačili, ustvarjena za vse,
            ki želijo izraziti svoj stil samozavestno, udobno in brez kompromisov.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {[{
            icon: ShoppingBag,
            title: "Naša vizija",
            text: "Ponujati trendovska in kakovostna oblačila, ki združujejo stil, udobje in dostopnost."
          }, {
            icon: Sparkles,
            title: "Naš stil",
            text: "Navdih jemljemo iz svetovnih modnih trendov ter jih prilagodimo vsakdanjemu življenju."
          }, {
            icon: Globe,
            title: "Dostopnost",
            text: "Spletna izkušnja, optimizirana za hiter, enostaven in varen nakup od kjerkoli."
          }, {
            icon: Heart,
            title: "Strast do mode",
            text: "Vsak kos je izbran s strastjo do mode in pozornostjo do detajlov."
          }].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="h-full rounded-2xl bg-white shadow-sm">
                <div className="flex flex-col items-center text-center space-y-4 p-6">
                  <item.icon className="h-10 w-10 text-primary" />
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <p className="text-gray-600">{item.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-900">Naša zgodba</h2>
          <p className="text-gray-600 leading-relaxed">
            StyleUp je nastal iz želje ustvariti spletno trgovino, kjer moda ni
            le trend, ampak način izražanja. Verjamemo, da se vsakdo zasluži
            počutiti dobro v oblačilih, ki jih nosi – ne glede na priložnost.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Naš cilj je zgraditi skupnost ljudi, ki cenijo stil, kakovost in
            samozavest. StyleUp ni le trgovina – je življenjski slog.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
