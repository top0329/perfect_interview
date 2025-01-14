"use client";
import { SignedOut, useAuth, UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Div from "../Div";
import Link from "next/link";
import DropDown from "./DropDown";

export default function Header({ variant }) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileToggle, setMobileToggle] = useState(false);
  const { isLoaded } = useAuth();
  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 0) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    });
  }, []);

  return (
    <>
      <header
        className={`cs-site_header cs-style1 text-uppercase ${
          variant ? variant : ""
        } cs-sticky_header ${isSticky ? "cs-sticky_header_active" : ""}`}
      >
        <Div className="cs-main_header">
          <Div className="container">
            <Div className="cs-main_header_in">
              <Div className="cs-main_header_left">
                <Link className="cs-site_branding" href="/">
                  <img src="/images/logo.png" alt="Logo" />
                </Link>
              </Div>
              <Div className="cs-main_header_center">
                <Div className="cs-nav cs-primary_font cs-medium">
                  <ul
                    className="cs-nav_list"
                    style={{ display: `${mobileToggle ? "block" : "none"}` }}
                  >
                    <li>
                      <Link href="/" onClick={() => setMobileToggle(false)}>
                        Home
                      </Link>
                    </li>

                    <li>
                      <Link href="/job" onClick={() => setMobileToggle(false)}>
                        Job
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/#price"
                        onClick={() => setMobileToggle(false)}
                      >
                        Price
                      </Link>
                    </li>
                  </ul>
                  <span
                    className={
                      mobileToggle
                        ? "cs-munu_toggle cs-toggle_active"
                        : "cs-munu_toggle"
                    }
                    onClick={() => setMobileToggle(!mobileToggle)}
                  >
                    <span></span>
                  </span>
                </Div>
              </Div>
              <div
                className="cs-main_header_right"
                style={{ marginRight: "50px" }}
              >
                {isLoaded ? (
                  <>
                    <UserButton />
                    <SignedOut>
                      <Link href="/sign-in">Signin</Link>
                    </SignedOut>
                  </>
                ) : (
                  <Link href="/sign-in">Signin</Link>
                )}
              </div>
            </Div>
          </Div>
        </Div>
      </header>
    </>
  );
}
