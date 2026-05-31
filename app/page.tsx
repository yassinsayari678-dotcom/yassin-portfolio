import PortfolioExperience from "./PortfolioExperience";
import { getPortfolioImages } from "@/lib/images";

export default async function Home() {
  const images = await getPortfolioImages();

  return <PortfolioExperience images={images} />;
}
