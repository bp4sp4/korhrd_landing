"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import ContactForm from "./components/ContactForm";

export default function Home() {
  const [counts, setCounts] = useState({
    students: 0,
    applications: 0,
    remaining: 0,
  });

  const contactFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const animateCounts = () => {
      const targets = {
        students: 12487,
        applications: 47,
        remaining: 6,
      };

      const duration = 2000; // 2초 동안 애니메이션
      const steps = 60;
      const stepValue = {
        students: targets.students / steps,
        applications: targets.applications / steps,
        remaining: targets.remaining / steps,
      };

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;

        setCounts({
          students: Math.min(
            Math.round(stepValue.students * currentStep),
            targets.students
          ),
          applications: Math.min(
            Math.round(stepValue.applications * currentStep),
            targets.applications
          ),
          remaining: Math.min(
            Math.round(stepValue.remaining * currentStep),
            targets.remaining
          ),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, duration / steps);
    };

    // 페이지 로드 직후 바로 애니메이션 시작
    animateCounts();
  }, []);

  const scrollToContactForm = () => {
    contactFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className={styles.container}>
      <section className={styles.mainSection}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <div className={styles.logoImage}>
            <span>
              <img
                src="/logo2.png"
                width={30}
                height={30}
                alt="logo"
                className={styles.logoImg}
              />
            </span>
          </div>
          <h1 className={styles.logoText}>Eduvisors</h1>
        </div>

        {/* Call-to-Action Button */}
        <button className={styles.ctaButton} onClick={scrollToContactForm}>
          상담 신청 하기
        </button>

        {/* Statistics */}
        <div className={styles.statsGrid}>
          {/* First Statistic */}
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{counts.students}명</div>
            <div className={styles.statUnderline}></div>
            <div className={styles.statLabel}>누적 학생 수</div>
          </div>

          {/* Second Statistic */}
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{counts.applications}명</div>
            <div className={styles.statUnderline}></div>
            <div className={styles.statLabel}>금일 상담 신청</div>
          </div>

          {/* Third Statistic */}
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{counts.remaining}명</div>
            <div className={styles.statUnderline}></div>
            <div className={styles.statLabel}>금일 잔여 상담 수</div>
          </div>
        </div>
      </section>
      <section className={styles.faqSection}>
        <img src="faq.png" alt="faq" className={styles.faqSectionImg} />
      </section>
      <section className={styles.contentSection}>
        <h2 className={styles.contentTitle}>
          에듀바이저스와 함께라면
          <br />{" "}
          <span className={styles.contentTitleSpan}>
            여러분들의 고민도 끝입니다!
          </span>
        </h2>

        <div className={styles.contentCards}>
          {/* Card 1 - Trophy */}
          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>
              <img
                src="/content001.png"
                alt="국가평생교육진흥원"
                className={styles.cardImage}
              />
            </div>
          </div>

          {/* Card 2 - Career Counselor */}
          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>
              <img
                src="/content002.png"
                alt="진로직업상담사"
                className={styles.cardImage}
              />
            </div>
          </div>

          {/* Card 3 - Notebook */}
          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>
              <img
                src="/content003.png"
                alt="교육원 이동 없이"
                className={styles.cardImage}
              />
            </div>
          </div>

          {/* Card 4 - Smartphone */}
          <div className={styles.contentCard}>
            <div className={styles.cardIcon}>
              <img
                src="/content004.png"
                alt="핸드폰 PC 수강"
                className={styles.cardImage}
              />
            </div>
          </div>
        </div>

        {/* Qua Section - 국가 공인 자격증 */}
        <div className={styles.quasection}>
          <h1 className={styles.contentTitle}>
            <span className={styles.contentTitleSpan}>국가 공인 자격증</span>
            <br />
            검증된 과정, 보장된 결과
          </h1>

          <div className={styles.quaCards}>
            {/* Qua Card 1 - 사회복지사 */}
            <div className={styles.quaCard}>
              <div className={styles.quaCardIcon}>
                <img
                  src="/qua001.png"
                  alt="사회복지사2급"
                  className={styles.quaCardImage}
                />
              </div>
            </div>

            {/* Qua Card 2 - 보육교사 */}
            <div className={styles.quaCard}>
              <div className={styles.quaCardIcon}>
                <img
                  src="/qua002.png"
                  alt="보육교사2급"
                  className={styles.quaCardImage}
                />
              </div>
            </div>

            {/* Qua Card 3 - 요양보호사 */}
            <div className={styles.quaCard}>
              <div className={styles.quaCardIcon}>
                <img
                  src="/qua003.png"
                  alt="요양보호사2급"
                  className={styles.quaCardImage}
                />
              </div>
            </div>

            {/* Qua Card 4 - 한국어교원 */}
            <div className={styles.quaCard}>
              <div className={styles.quaCardIcon}>
                <img
                  src="/qua004.png"
                  alt="한국어교원2급"
                  className={styles.quaCardImage}
                />
              </div>
            </div>
          </div>
          <div>
            <h1 className={styles.contentTitle}>
              이외에도 다양한
              <br />
              <span className={styles.contentTitleSpan}>
                국가 공인 자격증 / 학사 학위 취득!
              </span>
            </h1>
            <img
              src="/qualist.png"
              alt="국가 공인 자격증 / 학사 학위 취득"
              className={styles.qualistImage}
            />
          </div>
        </div>
      </section>
      <section className={styles.quasection2}></section>
      {/* Study Features Section */}
      <section className={styles.studyFeaturesSection}>
        <div className={styles.studyFeaturesContainer}>
          {/* Study Feature 1 */}
          <div className={styles.studyFeature}>
            <div className={styles.studyFeatureImage}>
              <div className={styles.studyFeatureText}>
                <h3>
                  <span className={styles.studyFeatureTextSpan}>
                    언제 어디서나!
                  </span>
                  <br /> 핸드폰 / PC / 태블릿 수강
                </h3>
              </div>
              <img
                src="/study001.png"
                alt="쉽고 편한 난이도, 육아/직장 병행 가능"
              />
            </div>
          </div>

          {/* Study Feature 2 */}
          <div className={styles.studyFeature}>
            <div className={styles.studyFeatureImage}>
              <div className={styles.studyFeatureText}>
                <h3>
                  <span className={styles.studyFeatureTextSpan}>
                    1:1 전문가 관리!
                  </span>
                  <br /> 처음 상담부터 합격까지
                </h3>
              </div>
              <img
                src="/study002.png"
                alt="언제 어디서나, 핸드폰/PC/태블릿 수강"
              />
            </div>
          </div>

          {/* Study Feature 3 */}
          <div className={styles.studyFeature}>
            <div className={styles.studyFeatureImage}>
              <div className={styles.studyFeatureText}>
                <h3>
                  <span className={styles.studyFeatureTextSpan}>
                    쉽고 편한 난이도!
                  </span>
                  <br /> 육아 / 직장 병행 가능
                </h3>
              </div>
              <img
                src="/study003.png"
                alt="1:1 전문가 관리, 처음 상담부터 합격까지"
              />
            </div>
          </div>
        </div>
      </section>
      <section className={styles.kakaotalkSection}>
        <h1 className={styles.kakaotalkTitle}>
          <span>&apos;한평생 에듀바이저스&apos;</span>와 함께한
          <br />
          선배 학습자분들의 <span>카톡 후기</span>를 공개합니다
        </h1>
      </section>

      {/* Infinite Flowing Swiper Section */}
      <section className={styles.infiniteSwiperSection}>
        <h2 className={styles.infiniteSwiperTitle}>
          에듀바이저스와 함께한 성공 스토리
        </h2>
        <div className={styles.swiperContainer}>
          {/* 첫 번째 세트 */}\
          <div className={styles.swiperItem}>
            <img src="/swiper001.png" alt="성공 스토리 3" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper002.jpeg" alt="성공 스토리 5" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper003.png" alt="성공 스토리 7" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper004.jpeg" alt="성공 스토리 8" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper005.jpeg" alt="성공 스토리 3" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper006.png" alt="성공 스토리 5" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper007.png" alt="성공 스토리 7" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper008.png" alt="성공 스토리 8" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper001.png" alt="성공 스토리 3" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper002.jpeg" alt="성공 스토리 5" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper003.png" alt="성공 스토리 7" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper004.jpeg" alt="성공 스토리 8" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper005.jpeg" alt="성공 스토리 3" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper006.png" alt="성공 스토리 5" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper007.png" alt="성공 스토리 7" />
          </div>
          <div className={styles.swiperItem}>
            <img src="/swiper008.png" alt="성공 스토리 8" />
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <div ref={contactFormRef}>
        <ContactForm />
      </div>
    </div>
  );
}
