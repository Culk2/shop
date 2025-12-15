import Link from 'next/link'
import { CheckCircle } from 'lucide-react'


export default function CheckoutSuccessPage() {
return (
<main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
<div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-10 text-center space-y-6">
<CheckCircle className="w-20 h-20 text-green-600 mx-auto" />


<h1 className="text-3xl font-bold text-gray-900">
Plačilo uspešno 🎉
</h1>


<p className="text-gray-600 text-lg">
Hvala za nakup pri <strong>StyleUp</strong>.
Vaše naročilo je bilo uspešno oddano.
</p>


<div className="flex flex-col gap-4 pt-6">
<Link
href="/orders"
className="bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition"
>
Ogled naročil
</Link>


<Link
href="/"
className="text-indigo-600 font-medium hover:underline"
>
Nadaljuj z nakupovanjem
</Link>
</div>
</div>
</main>
)
}