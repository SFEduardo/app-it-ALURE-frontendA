import hero from "../assets/hero.png"

export default function Hero() {
  return (
    <div>
      <img src={hero} className="max-h[600px] w-full object-cover" />
    </div>
  )
}
