document.addEventListener("DOMContentLoaded", () => {

    /*** ===== Swiper Main ===== ***/
    const mainSwiperEl = document.querySelector(".main-swiper");
    if (mainSwiperEl) {
        // Підключення стилів Swiper 11
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css";
        document.head.appendChild(link);

        // Підключення скрипта Swiper 11
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js";
        script.onload = () => initMainSwiper();
        document.body.appendChild(script);
    }

    function initMainSwiper() {
        const el = document.querySelector(".main-swiper");
        if (!el) return;
        new Swiper(el, {
            loop: true,
            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }


    /*** ===== Scroll Reveal Text ===== ***/
    const scrollRevealSection = document.getElementById('scroll-reveal');
    const revealTextEl = document.getElementById('reveal-text');
    if (scrollRevealSection && revealTextEl) {
        function wrapTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
                const frag = document.createDocumentFragment();
                for (let char of node.textContent) {
                    if (char === ' ') frag.appendChild(document.createTextNode(' '));
                    else { const span = document.createElement('span'); span.textContent = char; frag.appendChild(span); }
                }
                node.parentNode.replaceChild(frag, node);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                node.childNodes.forEach(wrapTextNodes);
            }
        }
        wrapTextNodes(revealTextEl);
        const spans = revealTextEl.querySelectorAll('span');

        function revealOnScroll() {
            const rect = scrollRevealSection.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            let scrollFraction = (windowHeight - rect.top) / (windowHeight + rect.height);
            scrollFraction = Math.min(Math.max(scrollFraction, 0), 1);
            const lettersToShow = Math.floor(spans.length * scrollFraction);
            spans.forEach((span, i) => {
                span.classList.toggle('visible', i < lettersToShow);
            });
            requestAnimationFrame(revealOnScroll);
        }
        window.addEventListener('load', () => requestAnimationFrame(revealOnScroll));
    }

    /*** ===== Features Swiper + GSAP ===== ***/
    const featuresSwiperEl = document.querySelector(".features-swiper");
    if (featuresSwiperEl && window.Swiper && window.gsap) {
        const swiper = new Swiper(featuresSwiperEl, {
            slidesPerView: 2.1,
            spaceBetween: 15,
            loop: true,
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev"
            },
            breakpoints: {768: {slidesPerView:2.2}, 930: {slidesPerView:2.7}, 1024: {slidesPerView:3.2}, 1280: {slidesPerView:4}}
        });

        const slides = featuresSwiperEl.querySelectorAll(".swiper-slide");
        const tl = gsap.timeline({paused: true});
        tl.from(slides, {
            delay: 0.6,
            y: 140,
            opacity: 0,
            rotate: i => (i % 2 === 0 ? -4 : 4),
            transformOrigin: "50% 80%",
            scale: 0.98,
            duration: 0.75,
            stagger: 0.14,
            ease: "power3.out"
        });

        ScrollTrigger.create({
            trigger: "#features",
            start: "top 80%",
            onEnter: () => { if (!tl.isActive() && tl.progress()===0) tl.play(); },
            onEnterBack: () => { if (!tl.isActive() && tl.progress()===0) tl.play(); },
        });

        swiper.on("slideChangeTransitionStart", () => {
            const active = swiper.slides[swiper.activeIndex];
            gsap.fromTo(active, {y:90,opacity:0,scale:0.98},{y:0,opacity:1,scale:1,duration:0.55,ease:"power3.out"});
        });

        const refreshAfterLoad = () => setTimeout(() => ScrollTrigger.refresh(true), 60);
        window.addEventListener("load", refreshAfterLoad);
        window.addEventListener("resize", () => ScrollTrigger.refresh());
        featuresSwiperEl.querySelectorAll("img").forEach(img => {
            if (!img.complete) img.addEventListener("load", refreshAfterLoad);
        });
    }

    /*** ===== FAQ Toggle ===== ***/
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            const toggle = item.querySelector('.faq-toggle div');
            gsap.set(answer, {height:0,opacity:0,y:20,filter:"blur(8px)",marginTop:"-8px"});
            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');
                faqItems.forEach(i => {
                    gsap.to(i.querySelector('.faq-answer'), {height:0,opacity:0,y:20,filter:"blur(8px)",duration:0.5,ease:"power3.inOut",marginTop:"-8px"});
                    i.classList.remove('open');
                    i.querySelector('.faq-toggle div')?.classList.remove('rotate-45');
                });
                if(!isOpen){
                    item.classList.add('open');
                    gsap.to(answer,{height:"auto",opacity:1,y:0,filter:"blur(0px)",duration:0.6,ease:"power3.out",marginTop:"0px"});
                    toggle.classList.add('rotate-45');
                }
            });
        });
    }

    /*** ===== Testimonials Swiper ===== ***/
    const testimonialsSwiperEl = document.querySelector(".testimonials-swiper-unique");
    if (testimonialsSwiperEl && window.Swiper && window.gsap) {
        const swiper = new Swiper(testimonialsSwiperEl, {
            slidesPerView: 1,
            loop: true,
            loopedSlides: testimonialsSwiperEl.querySelectorAll(".swiper-slide").length,
            spaceBetween: 40,
            effect: "fade",
            fadeEffect: {crossFade:true},
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                renderBullet: (index,className)=>`<span class="${className} relative w-12 h-1 bg-white/20 rounded-full overflow-hidden"><span class="progress absolute inset-0 w-0 h-full bg-white/80 rounded-full"></span></span>`
            },
            navigation: {nextEl:".swiper-button-next",prevEl:".swiper-button-prev"},
            autoplay: {delay:4000,disableOnInteraction:false}
        });

        const animateAuthor = slide => {
            const author = slide.querySelector(".mt-16.flex.items-center");
            if(!author) return;
            gsap.set(author,{opacity:0,y:-60});
            gsap.to(author,{opacity:1,y:0,duration:0.7,ease:"power3.out"});
        };
        const animateSlide = slide => {
            const text = slide.querySelector(".testimonial-text");
            if(!text) return;
            gsap.set(text,{opacity:0,filter:"blur(8px)",y:30});
            gsap.to(text,{opacity:1,filter:"blur(0px)",y:0,duration:0.9,ease:"power3.out"});
        };
        const animateBullet = index => {
            testimonialsSwiperEl.querySelectorAll(".swiper-pagination .swiper-pagination-bullet").forEach((bullet,i)=>{
                const prog = bullet.querySelector(".progress");
                if(!prog) return;
                gsap.set(prog,{width:"0%"});
                if(i===index) gsap.to(prog,{width:"100%",duration:4,ease:"linear"});
            });
        };

        animateSlide(swiper.slides[swiper.activeIndex]);
        animateAuthor(swiper.slides[swiper.activeIndex]);
        animateBullet(swiper.realIndex);

        swiper.on("slideChangeTransitionStart", ()=>{
            swiper.slides.forEach(slide=>{
                gsap.to(slide.querySelector(".testimonial-text"),{opacity:0,filter:"blur(6px)",y:30,duration:0.3});
                gsap.to(slide.querySelector(".mt-16.flex.items-center"),{opacity:0,y:-60,duration:0.3});
            });
            testimonialsSwiperEl.querySelectorAll(".swiper-pagination .progress").forEach(el=>gsap.set(el,{width:"0%"}));
        });

        swiper.on("slideChangeTransitionEnd", ()=>{
            animateSlide(swiper.slides[swiper.activeIndex]);
            animateAuthor(swiper.slides[swiper.activeIndex]);
            animateBullet(swiper.realIndex);
        });
    }

    /*** ===== Headline + Badge Animation ===== ***/
    const headlineEl = document.getElementById("headline");
    if (headlineEl) {
        function wrapWords(node) {
            const frag = document.createDocumentFragment();
            node.childNodes.forEach(child=>{
                if(child.nodeType===Node.TEXT_NODE){
                    child.textContent.split(/(\s+)/).forEach(word=>{
                        if(!word) return;
                        if(/\s+/.test(word)) frag.appendChild(document.createTextNode(word));
                        else {
                            const span=document.createElement("span");
                            span.textContent=word;
                            span.style.display="inline-block";
                            span.style.opacity="0";
                            span.style.transform="translateY(20px)";
                            span.style.filter="blur(14px)";
                            span.style.transition="all 0.5s ease-out";
                            frag.appendChild(span);
                        }
                    });
                } else if(child.nodeType===Node.ELEMENT_NODE){
                    const el=child.cloneNode(false);
                    el.appendChild(wrapWords(child));
                    frag.appendChild(el);
                }
            });
            return frag;
        }

        const wrapped = wrapWords(headlineEl);
        headlineEl.innerHTML="";
        headlineEl.appendChild(wrapped);

        const words = headlineEl.querySelectorAll("span");
        words.forEach((word,i)=>setTimeout(()=>{word.style.opacity="1";word.style.transform="translateY(0)";word.style.filter="blur(0)";},i*100));

        const delayBase = words.length*100;

        const badge = document.getElementById("badge");
        if(badge){
            badge.style.opacity="0";
            badge.style.transform="translateY(20px)";
            badge.style.transition="all 0.5s ease-out";
            setTimeout(()=>{badge.style.opacity="1";badge.style.transform="translateY(0)";},delayBase+200);
        }

        const subtitle = document.getElementById("subtitle");
        if(subtitle){
            subtitle.style.opacity="0";
            subtitle.style.transform="translateY(20px)";
            subtitle.style.transition="all 0.5s ease-out";
            setTimeout(()=>{subtitle.style.opacity="1";subtitle.style.transform="translateY(0)";},delayBase+400);
        }

        const buttons = document.getElementById("buttons");
        if(buttons){
            buttons.style.opacity="0";
            buttons.style.transform="translateY(20px)";
            buttons.style.transition="all 0.5s ease-out";
            setTimeout(()=>{
                buttons.style.opacity="1";
                buttons.style.transform="translateY(0)";
                buttons.querySelectorAll("a").forEach((btn,i)=>{
                    btn.style.opacity="0";
                    btn.style.transform="translateY(20px)";
                    btn.style.transition="all 0.3s ease-out";
                    setTimeout(()=>{btn.style.opacity="1";btn.style.transform="translateY(0)";},i*150);
                });
            },delayBase+600);
        }
    }

    /*** ===== Headline2 + Buttons2 Animation with IntersectionObserver ===== ***/
    const headline2El = document.getElementById("headline2");
    const buttons2El = document.getElementById("buttons2");
    if(headline2El && buttons2El){
        const observer2 = new IntersectionObserver((entries,obs)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    animateSection(headline2El,buttons2El);
                    obs.unobserve(entry.target);
                }
            });
        },{threshold:0.3});
        observer2.observe(headline2El);

        function animateSection(headline, buttons){
            function wrapText(node){
                const frag=document.createDocumentFragment();
                node.childNodes.forEach(child=>{
                    if(child.nodeType===Node.TEXT_NODE){
                        child.textContent.split(/(\s+)/).forEach(word=>{
                            if(!word) return;
                            if(/\s+/.test(word)) frag.appendChild(document.createTextNode(word));
                            else{
                                const span=document.createElement("span");
                                span.textContent=word;
                                span.style.display="inline-block";
                                span.style.opacity="0";
                                span.style.transform="translateY(20px)";
                                span.style.filter="blur(14px)";
                                span.style.transition="all 0.5s ease-out";
                                frag.appendChild(span);
                            }
                        });
                    } else if(child.nodeType===Node.ELEMENT_NODE){
                        const el=child.cloneNode(false);
                        el.appendChild(wrapText(child));
                        frag.appendChild(el);
                    }
                });
                return frag;
            }

            const wrapped=wrapText(headline);
            headline.innerHTML="";
            headline.appendChild(wrapped);

            const words=headline.querySelectorAll("span");
            words.forEach((word,i)=>setTimeout(()=>{word.style.opacity="1";word.style.transform="translateY(0)";word.style.filter="blur(0)";},i*100));
            const delayBase=words.length*100;

            buttons.style.opacity="0";
            buttons.style.transform="translateY(20px)";
            buttons.style.transition="all 0.5s ease-out";

            setTimeout(()=>{
                buttons.style.opacity="1";
                buttons.style.transform="translateY(0)";
                buttons.querySelectorAll("a").forEach((btn,i)=>{
                    btn.style.opacity="0";
                    btn.style.transform="translateY(20px)";
                    btn.style.transition="all 0.3s ease-out";
                    setTimeout(()=>{btn.style.opacity="1";btn.style.transform="translateY(0)";},i*150);
                });
            },delayBase+400);
        }
    }

});