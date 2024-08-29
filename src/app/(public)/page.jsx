"use client";

import Cta from "@/app/ui/Cta";
import Div from "@/app/ui/Div";
import FunFact from "@/app/ui/FunFact";
import Hero from "@/app/ui/Hero";
import LogoList from "@/app/ui/LogoList";
import SectionHeading from "@/app/ui/SectionHeading";
import PortfolioSlider from "@/app/ui/Slider/PortfolioSlider";
import TeamSlider from "@/app/ui/Slider/TeamSlider";
import TimelineSlider from "@/app/ui/Slider/TimelineSlider";
import Spacing from "@/app/ui/Spacing";

// Hero Social Links
const heroSocialLinks = [
  {
    name: "Behance",
    links: "/",
  },
  {
    name: "Twitter",
    links: "/",
  },
];
// FunFact Data
const funfaceData = [
  {
    title: "Global Happy Clients",
    factNumber: "40K",
  },
  {
    title: "Project Completed",
    factNumber: "50K",
  },
  {
    title: "Team Members",
    factNumber: "245",
  },
  {
    title: "Digital products",
    factNumber: "550",
  },
];

export default function Home() {
  return (
    <>
      {/* Start Hero Section */}
      <Hero
        title="Perfect <br/>Interview site"
        subtitle="We deliver best problem solving solution for our client and provide finest finishing product in present and upcoming future."
        btnText="Get a Quote"
        btnLink="/contact"
        scrollDownId="#service"
        socialLinksHeading="Follow Us"
        heroSocialLinks={heroSocialLinks}
        bgImageUrl="/images/hero_bg_2.jpeg"
      />
      {/* End Hero Section */}
      {/* Start FunFact Section */}
      <div className="container">
        <FunFact
          variant="cs-type1"
          title="Our fun fact"
          subtitle="Sed ut perspiciatis unde omnis iste natus error voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis."
          data={funfaceData}
        />
      </div>
      {/* End FunFact Section */}
      <Spacing lg="60" md="40" />
      {/* Start LogoList Section */}
      <Div className="container">
        <LogoList />
      </Div>
      {/* End LogoList Section */}
      <Spacing lg="60" md="40" />
      {/* Start CTA Section */}
      <Div className="container">
        <Cta
          title="Let’s disscuse make <br />something <i>cool</i> together"
          btnText="Apply For Meeting"
          btnLink="/contact"
          bgSrc="/images/cta_bg.jpeg"
        />
      </Div>
      {/* End CTA Section */}
    </>
  );
}