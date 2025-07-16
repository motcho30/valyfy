import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DesignInspiration = ({ onNavigateToFeature }) => {
  const [selectedCard, setSelectedCard] = useState(null);
  
  const prefixText = `Transform my current website design, CSS styling and overall frontend into the following strict and descriptive design and frontend specification document. Make sure to not change any copy, context or functionality we currently have in the website, this is solely a design UI/UX and frontend redesign.

`;

  const designCards = [
    {
      id: 1,
      company: 'Homerun',
      description: 'Clean recruitment platform with intuitive candidate flow',
      image: '/designinspoimages/homerun1.png',
      logo: '/aitoolslogos/bolt.png', // Using placeholder since no homerun logo found
      images: [
        '/designinspoimages/homerun1.png',
        '/designinspoimages/homerun2.png',
        '/designinspoimages/homerun3.png',
        '/designinspoimages/homerun4.png'
      ],
      prompt: prefixText + `


Website Structure and Technology
The website is built using a standard HTML and CSS structure. A single CSS file, homerundesign.css, contains all the styling rules, indicating a centralized approach to managing the site's appearance. The use of classes like style-0, style-1, etc., suggests a systematic, if not programmatically generated, approach to styling individual elements. The HTML structure is semantic, with clear <header>, <section>, and <footer> elements, which is beneficial for both search engine optimization (SEO) and accessibility.

Color Palette
The color scheme is a key contributor to the website's clean and inviting feel. The palette consists of:

Primary Colors: A vibrant blue (#4F75FE) and a professional green (#00C275) are used for calls-to-action and to highlight important information.

Secondary Colors: A soft pink (#F0A8FA) is used for the "Teams love Homerun" section, adding a touch of warmth and personality.

Neutral Colors: A range of grays and off-whites (#FFFFFF, #FAFAF7, #F5F1EC) are used for backgrounds and text, creating a sense of spaciousness and readability.

Accent Colors: A dark charcoal (#2D2323) is used for typography, providing strong contrast and a modern feel.

Typography
The typography is a standout feature, utilizing a sans-serif font family, likely "GT America" and "GT Walsheim," as referenced in the CSS. The font choice contributes to the modern and clean aesthetic.

Headings: Headings are large, bold, and have tight letter spacing, creating a strong visual impact. The hero section's <h1> is a prominent example of this.

Body Text: The body text is set in a smaller, highly readable sans-serif font, ensuring a comfortable reading experience.

Font Weights: The site makes effective use of different font weights to create a clear visual hierarchy. Bold weights are used for headings and calls-to-action, while lighter weights are used for body copy.

Layout and Spacing
The layout is spacious and uncluttered, with generous use of white space that guides the user's eye and improves readability.

Grid System: The layout appears to be based on a grid system, which ensures consistency and alignment of elements across the page.

Padding and Margins: Ample padding and margins are used around all elements, preventing a cramped or cluttered look.

Max-Width: The content is constrained to a maximum width, which prevents it from becoming too wide on larger screens and maintains a comfortable reading line length.

Navigation Bar
The navigation bar is a sticky element, meaning it remains at the top of the page as the user scrolls. This provides easy access to the main sections of the site at all times.

Logo: The Homerun logo is prominently displayed on the left side of the navigation bar.

Navigation Links: The navigation links are clear and concise, with a "Resources" dropdown to house additional pages without cluttering the main navigation.

Call-to-Action Buttons: The "Book a demo" and "Start free trial" buttons are styled with contrasting colors to make them stand out and encourage user interaction.

Hero Section
The hero section is the first thing a user sees and is designed to make a strong first impression.

Headline: A large, bold headline clearly communicates the value proposition of the product.

Subheading: A concise subheading provides additional information and context.

Call-to-Action Buttons: Prominent call-to-action buttons encourage users to take the next step.

Social Proof: The inclusion of Capterra ratings, customer satisfaction scores, and the number of teams using the platform builds trust and credibility.

Hero Image: A large, high-quality image on the right side of the hero section provides a visual representation of the product.

Feature Sections
The feature sections use a combination of text and images to showcase the key functionalities of the product.

Alternating Layout: The layout alternates between placing the image on the left and the text on the right, which creates visual interest and breaks up the monotony of the page.

Clear Headings and Subheadings: Each feature is introduced with a clear and concise heading and subheading.

Accordion Menus: An accordion-style menu is used to reveal more detailed information about each feature without overwhelming the user with too much text at once.

Testimonial Section
The testimonial section leverages social proof to build trust and credibility with potential customers.

Marquee-style Scroller: Testimonials are displayed in a marquee-style scroller that automatically moves horizontally across the page.

Customer Photos: Including photos of the customers who provided the testimonials adds a personal touch and makes the testimonials feel more authentic.

Clear Attributions: Each testimonial is clearly attributed to the person who provided it, including their name and company.

Footer
The footer is well-organized and provides easy access to important information and resources.

Sitemap: The footer includes a sitemap with links to all the main pages of the website.

Newsletter Signup: A prominent newsletter signup form encourages users to stay connected with the company.

Social Media Links: Links to Homerun's social media profiles are included, allowing users to connect with the company on other platforms.

Animations and Effects
The website uses subtle animations and effects to enhance the user experience and create a more dynamic and engaging feel.

Hover Effects: Buttons and links have hover effects that provide visual feedback to the user and make the interface feel more responsive.

Marquee Scroller: The testimonial section uses a marquee scroller to display a large number of testimonials in a relatively small space.

Fade-in and Slide-in Effects: Elements on the page may use fade-in or slide-in animations as the user scrolls, which adds a touch of elegance and sophistication to the design.

Global Styles & Page Structure
The foundation of the page is set in the <body> tag, establishing the default typography and layout properties for the entire site.

HTML Structure (<body> tag):

HTML

<body style="cursor: auto; clear: none; flex-flow: column nowrap; align-items: center; display: flex; color: rgb(74, 62, 62); background-color: rgb(255, 255, 255); flex-direction: column; font-family: 'GT America', sans-serif; min-height: 100%; margin: 0px; font-size: 14px; line-height: 20px; box-sizing: border-box;">
...
</body>
CSS Analysis (.style-0):

display: flex; flex-direction: column; align-items: center;: This establishes a vertical flexbox layout for the entire page, centering the main content column. This is a modern and effective way to manage the primary layout.

font-family: 'GT America', sans-serif;: Sets the default font for the entire page.

color: rgb(74, 62, 62);: A dark, warm grey for body text, which is softer than pure black and enhances readability.

background-color: rgb(255, 255, 255);: A standard white background.

font-size: 14px; line-height: 20px;: Default text size and line height for base-level text.

box-sizing: border-box;: Applied universally, this is a crucial best practice that simplifies layout calculations by including padding and border in the element's total width and height.

Navigation Bar
The navigation is a clean, sticky header that remains visible on scroll. It contains the brand logo, primary navigation links, a dropdown menu for secondary resources, and prominent call-to-action buttons.

HTML Structure:
The navigation bar is a div element with position: sticky and a high z-index to keep it on top of other content. It uses a flexbox layout to space out its child elements.

HTML

<div theme="white" ... style="z-index: 999; ... position: sticky; top: 0px; ...">
    <div ... style="max-width: 1380px; justify-content: space-between; ... display: flex;">
        <a href="/" ...>...</a>
        <nav role="navigation" ...>
            <div data-nav-btn-container="" ...>
                <a href="/demo" ...>Book a demo</a>
                <a href="/trial" ...>Start free trial</a>
            </div>
        </nav>
    </div>
</div>
Component & Styling Breakdown:

Sticky Container (.style-4):

position: sticky; top: 0px;: This is the key to the navigation bar "sticking" to the top of the viewport when the user scrolls.

z-index: 999;: Ensures the navigation bar stays above other page content.

background-color: rgb(255, 255, 255);: The bar has a solid white background.

Navigation Links (<a> tags inside .style-31):

padding: 18px 12px;: Generous padding creates a large, clickable area.

font-size: 16px; font-weight: 400;: Clear and legible link text.

transition: background-color 0.3s;: A subtle transition effect on hover provides user feedback.

The "Organise your hiring" and "Manage your team" links include a styled SVG icon next to the text, contained within a flex div.

"Resources" Dropdown (.style-57):

This is a div that likely has JavaScript attached to it to toggle the visibility of the nested <nav> menu on hover (indicated by data-hover="true").

The dropdown content (.style-64) is a grid layout, allowing for complex and organized content. It has a box-shadow and a border to visually separate it from the page content below.

Call-to-Action Buttons:

"Log in" Button: Styled as a "ghost" button.

border: 1px solid rgb(237, 235, 231);

background-color: rgba(0, 0, 0, 0); (transparent)

color: rgb(74, 62, 62);

"Book a demo" Button (.style-141): A solid, high-contrast button.

background-color: rgb(45, 35, 35); (dark charcoal)

color: rgb(255, 255, 255); (white text)

"Start free trial" Button (.style-142): The primary call-to-action, using the main brand color.

background-color: rgb(79, 117, 254); (brand blue)

color: rgb(255, 255, 255); (white text)

All buttons share a border-radius: 12px; for a modern, rounded look.

Hero Section
This section makes an immediate impact with a large, bold heading, a clear value proposition, and prominent calls to action, balanced by a visually appealing product image.

HTML Structure:
A two-column layout is achieved using display: flex on the container (.style-316). The left column (.style-317) contains the text content and CTAs, while the right holds the hero image.

HTML

<section class="style-313">
    <div class="style-316">
        <div class="style-317">
            <h1 class="style-319">Beautiful<br>HR tools for modern teams.</h1>
            <p class="style-321">Transform your hiring process...</p>
            <div class="style-322">...</div>
        </div>
        <img ... class="style-349" src="...">
    </div>
</section>
Component & Styling Breakdown:

Main Headline (<h1>, .style-319):

font-family: 'GT Walsheim', sans-serif;: This distinct, bold font is reserved for major headings.

font-size: 64px; line-height: 64px;: Creates a large, impactful title.

font-weight: 900;: A very heavy font weight for maximum emphasis.

letter-spacing: -1px;: Tight letter-spacing gives the headline a compact, modern feel.

Sub-headline (<p>, .style-321):

font-size: 22px; line-height: 30.8px;: A larger-than-body font size that is easy to read and complements the main headline.

color: rgb(74, 62, 62);: Uses the default body text color.

Social Proof (.style-330):

This section uses a display: grid layout to arrange three items in a row.

Each item is a flex container (.style-331, .style-339, .style-344) that aligns an icon and its text.

The star rating for Capterra is cleverly implemented with a background-image on a <strong> tag, showing five stars.

Hero Image (<img>, .style-349):

border-radius: 40px;: Large, rounded corners give the image a soft, modern look that matches the overall aesthetic.

Feature Sections
The "Organise your hiring" and "Manage your team" sections use a consistent, clean layout to present product features. A key UX element is the use of accordions to reveal more information on demand.

HTML Structure:
These sections use a two-column flex layout. One column contains the descriptive text and accordion menu, while the other contains a large product image.

HTML

<section class="style-425">
    <div class="style-426">
        <h2 class="style-431">Organise your hiring.</h2>
        <div class="style-432">...</div>
        <div class="style-435">
            <div data-w-id="..." class="style-436">
                 <div role="button" class="style-437">...</div>
                 <nav class="style-442">...</nav>
            </div>
        </div>
    </div>
    <div class="style-496">...</div>
</section>
Component & Styling Breakdown:

Section Layout (.style-425, .style-498):

These sections have a large gap: 110px between the text and image columns, creating ample white space.

They feature a high border-radius: 40px; and generous padding: 48px 64px;.

The "Manage your team" section uses a background-image: radial-gradient(...) for a subtle, sophisticated background texture.

Accordion Menu:

Each accordion item (.style-436, .style-509) is a self-contained unit with a border-radius: 10px;.

The trigger (.style-437) is a flex container that uses justify-content: space-between; to place the title on the left and the dropdown arrow on the right.

The expandable content area is a <nav> tag (.style-442). Its initial height: 0px; keeps it hidden. An interaction (likely JavaScript triggered by the data-w-id) would change the height to auto to reveal the content with a smooth transition.

The text inside the expanded accordion (.style-444) has a slightly smaller font size (18px) than the feature description, creating a clear hierarchy.

Testimonials Section
This section uses a dynamic, auto-scrolling marquee to display customer testimonials, building trust through social proof.

HTML Structure:
A flex container (.style-583) with overflow: hidden; acts as the viewport for the marquee. Inside, two identical divs (.style-584, .style-650) contain the list of testimonials. This duplication is a classic technique to create a seamless, infinite scrolling loop.

HTML

<section class="style-572">
    ...
    <div class="style-583">
        <div data-duration="50" data-marquee="target" class="style-584">
            <div role="listitem" class="style-586">...</div>
            ...
        </div>
        <div data-duration="50" data-marquee="target" class="style-650">
             <div role="listitem" class="style-652">...</div>
             ...
        </div>
    </div>
</section>
Component & Styling Breakdown:

Section Styling (.style-572): The section has a vibrant pink background-color: rgb(240, 168, 250);, which makes it stand out.

Testimonial Card (.style-586):

background-color: rgb(245, 241, 236);: A warm, off-white background.

border-radius: 20px;: Rounded corners.

box-shadow: rgb(211, 134, 222) 0px 4px 5px 0px;: A subtle, colored drop shadow that adds depth.

padding: 60px 50px;: Very generous padding, giving the content ample space.

The quote itself (.style-587) has a large font-size: 28px;.

Author Information (.style-588):

The author's avatar (.style-589) is made circular by applying border-radius: 100%; to its container and setting overflow: hidden;.

Footer
The footer is a well-organized, multi-column layout providing access to key pages, company information, and a newsletter signup form.

HTML Structure:
The footer uses display: grid (.style-809) with four defined columns to neatly arrange the content.

HTML

<div class="style-807">
    <div class="style-808">
        <div class="style-809">
            <div class="style-810">...</div>
            <div class="style-833">...</div>
            <div class="style-858">...</div>
            <div class="style-884">...</div>
        </div>
    </div>
</div>
Component & Styling Breakdown:

Layout (.style-809):

display: grid; grid-template-columns: 303px 303px 303px 303px;: Creates four equal-width columns.

The first column (newsletter) is visually separated and occupies a different part of the grid in the original design.

Link Lists (<ul>):

The lists of links (.style-837, .style-862, etc.) have list-style: outside none none; and padding-left: 0px; to remove default bullet points and indentation.

Footer links (.style-839, etc.) are styled with a muted color, color: rgb(115, 107, 107);, and have a transition for a subtle hover effect.

Newsletter Form (.style-819):

The email input (.style-820) and the submit button (.style-821) are styled to appear as a single, cohesive unit. This is achieved by giving the input a border-radius only on the left (30px 0px 0px 30px) and the button a border-radius only on the right (0px 30px 30px 0px).

Social Media Icons (.style-826):

Each icon is an <a> tag with a background-color: rgb(45, 35, 35); and border-radius: 100px; to create the circular shape. They are flex containers that center the SVG icon within.

Sitemap: The footer includes a sitemap with links to all the main pages of the website.

Newsletter Signup: A prominent newsletter signup form encourages users to stay connected with the company.

Social Media Links: Links to Homerun's social media profiles are included, allowing users to connect with the company on other platforms.

Animations and Effects
The website uses subtle animations and effects to enhance the user experience and create a more dynamic and engaging feel.

Hover Effects: Buttons and links have hover effects that provide visual feedback to the user and make the interface feel more responsive.

Marquee Scroller: The testimonial section uses a marquee scroller to display a large number of testimonials in a relatively small space.

Fade-in and Slide-in Effects: Elements on the page may use fade-in or slide-in animations as the user scrolls, which adds a touch of elegance and sophistication to the design.

Global Styles & Page Structure
The foundation of the page is set in the <body> tag, establishing the default typography and layout properties for the entire site.

HTML Structure (<body> tag):

<body style="cursor: auto; clear: none; flex-flow: column nowrap; align-items: center; display: flex; color: rgb(74, 62, 62); background-color: rgb(255, 255, 255); flex-direction: column; font-family: 'GT America', sans-serif; min-height: 100%; margin: 0px; font-size: 14px; line-height: 20px; box-sizing: border-box;">
...
</body>

CSS Analysis (.style-0):

display: flex; flex-direction: column; align-items: center;: This establishes a vertical flexbox layout for the entire page, centering the main content column. This is a modern and effective way to manage the primary layout.

font-family: 'GT America', sans-serif;: Sets the default font for the entire page.

color: rgb(74, 62, 62);: A dark, warm grey for body text, which is softer than pure black and enhances readability.

background-color: rgb(255, 255, 255);: A standard white background.

font-size: 14px; line-height: 20px;: Default text size and line height for base-level text.

box-sizing: border-box;: Applied universally, this is a crucial best practice that simplifies layout calculations by including padding and border in the element's total width and height.

Navigation Bar
The navigation is a clean, sticky header that remains visible on scroll. It contains the brand logo, primary navigation links, a dropdown menu for secondary resources, and prominent call-to-action buttons.

HTML Structure:
The navigation bar is a div element with position: sticky and a high z-index to keep it on top of other content. It uses a flexbox layout to space out its child elements.

<div theme="white" ... style="z-index: 999; ... position: sticky; top: 0px; ...">
    <div ... style="max-width: 1380px; justify-content: space-between; ... display: flex;">
        <a href="/" ...>...</a>
        <nav role="navigation" ...>
            <div data-nav-btn-container="" ...>
                <a href="/demo" ...>Book a demo</a>
                <a href="/trial" ...>Start free trial</a>
            </div>
        </nav>
    </div>
</div>

Component & Styling Breakdown:

Sticky Container (.style-4):

position: sticky; top: 0px;: This is the key to the navigation bar "sticking" to the top of the viewport when the user scrolls.

z-index: 999;: Ensures the navigation bar stays above other page content.

background-color: rgb(255, 255, 255);: The bar has a solid white background.

Navigation Links (<a> tags inside .style-31):

padding: 18px 12px;: Generous padding creates a large, clickable area.

font-size: 16px; font-weight: 400;: Clear and legible link text.

transition: background-color 0.3s;: A subtle transition effect on hover provides user feedback.

The "Organise your hiring" and "Manage your team" links include a styled SVG icon next to the text, contained within a flex div.

"Resources" Dropdown (.style-57):

This is a div that likely has JavaScript attached to it to toggle the visibility of the nested <nav> menu on hover (indicated by data-hover="true").

The dropdown content (.style-64) is a grid layout, allowing for complex and organized content. It has a box-shadow and a border to visually separate it from the page content below.

Call-to-Action Buttons:

"Log in" Button: Styled as a "ghost" button.

border: 1px solid rgb(237, 235, 231);

background-color: rgba(0, 0, 0, 0); (transparent)

color: rgb(74, 62, 62);

"Book a demo" Button (.style-141): A solid, high-contrast button.

background-color: rgb(45, 35, 35); (dark charcoal)

color: rgb(255, 255, 255); (white text)

"Start free trial" Button (.style-142): The primary call-to-action, using the main brand color.

background-color: rgb(79, 117, 254); (brand blue)

color: rgb(255, 255, 255); (white text)

All buttons share a border-radius: 12px; for a modern, rounded look.

Hero Section
This section makes an immediate impact with a large, bold heading, a clear value proposition, and prominent calls to action, balanced by a visually appealing product image.

HTML Structure:
A two-column layout is achieved using display: flex on the container (.style-316). The left column (.style-317) contains the text content and CTAs, while the right holds the hero image.

<section class="style-313">
    <div class="style-316">
        <div class="style-317">
            <h1 class="style-319">Beautiful<br>HR tools for modern teams.</h1>
            <p class="style-321">Transform your hiring process...</p>
            <div class="style-322">...</div>
        </div>
        <img ... class="style-349" src="...">
    </div>
</section>

Component & Styling Breakdown:

Main Headline (<h1>, .style-319):

font-family: 'GT Walsheim', sans-serif;: This distinct, bold font is reserved for major headings.

font-size: 64px; line-height: 64px;: Creates a large, impactful title.

font-weight: 900;: A very heavy font weight for maximum emphasis.

letter-spacing: -1px;: Tight letter-spacing gives the headline a compact, modern feel.

Sub-headline (<p>, .style-321):

font-size: 22px; line-height: 30.8px;: A larger-than-body font size that is easy to read and complements the main headline.

color: rgb(74, 62, 62);: Uses the default body text color.

Social Proof (.style-330):

This section uses a display: grid layout to arrange three items in a row.

Each item is a flex container (.style-331, .style-339, .style-344) that aligns an icon and its text.

The star rating for Capterra is cleverly implemented with a background-image on a <strong> tag, showing five stars.

Hero Image (<img>, .style-349):

border-radius: 40px;: Large, rounded corners give the image a soft, modern look that matches the overall aesthetic.

Feature Sections
The "Organise your hiring" and "Manage your team" sections use a consistent, clean layout to present product features. A key UX element is the use of accordions to reveal more information on demand.

HTML Structure:
These sections use a two-column flex layout. One column contains the descriptive text and accordion menu, while the other contains a large product image.

<section class="style-425">
    <div class="style-426">
        <h2 class="style-431">Organise your hiring.</h2>
        <div class="style-432">...</div>
        <div class="style-435">
            <div data-w-id="..." class="style-436">
                 <div role="button" class="style-437">...</div>
                 <nav class="style-442">...</nav>
            </div>
        </div>
    </div>
    <div class="style-496">...</div>
</section>

Component & Styling Breakdown:

Section Layout (.style-425, .style-498):

These sections have a large gap: 110px between the text and image columns, creating ample white space.

They feature a high border-radius: 40px; and generous padding: 48px 64px;.

The "Manage your team" section uses a background-image: radial-gradient(...) for a subtle, sophisticated background texture.

Accordion Menu:

Each accordion item (.style-436, .style-509) is a self-contained unit with a border-radius: 10px;.

The trigger (.style-437) is a flex container that uses justify-content: space-between; to place the title on the left and the dropdown arrow on the right.

The expandable content area is a <nav> tag (.style-442). Its initial height: 0px; keeps it hidden. An interaction (likely JavaScript triggered by the data-w-id) would change the height to auto to reveal the content with a smooth transition.

The text inside the expanded accordion (.style-444) has a slightly smaller font size (18px) than the feature description, creating a clear hierarchy.

Testimonials Section
This section uses a dynamic, auto-scrolling marquee to display customer testimonials, building trust through social proof.

HTML Structure:
A flex container (.style-583) with overflow: hidden; acts as the viewport for the marquee. Inside, two identical divs (.style-584, .style-650) contain the list of testimonials. This duplication is a classic technique to create a seamless, infinite scrolling loop.

<section class="style-572">
    ...
    <div class="style-583">
        <div data-duration="50" data-marquee="target" class="style-584">
            <div role="listitem" class="style-586">...</div>
            ...
        </div>
        <div data-duration="50" data-marquee="target" class="style-650">
             <div role="listitem" class="style-652">...</div>
             ...
        </div>
    </div>
</section>

Component & Styling Breakdown:

Section Styling (.style-572): The section has a vibrant pink background-color: rgb(240, 168, 250);, which makes it stand out.

Testimonial Card (.style-586):

background-color: rgb(245, 241, 236);: A warm, off-white background.

border-radius: 20px;: Rounded corners.

box-shadow: rgb(211, 134, 222) 0px 4px 5px 0px;: A subtle, colored drop shadow that adds depth.

padding: 60px 50px;: Very generous padding, giving the content ample space.

The quote itself (.style-587) has a large font-size: 28px;.

Author Information (.style-588):

The author's avatar (.style-589) is made circular by applying border-radius: 100%; to its container and setting overflow: hidden;.

Footer
The footer is a well-organized, multi-column layout providing access to key pages, company information, and a newsletter signup form.

HTML Structure:
The footer uses display: grid (.style-809) with four defined columns to neatly arrange the content.

<div class="style-807">
    <div class="style-808">
        <div class="style-809">
            <div class="style-810">...</div>
            <div class="style-833">...</div>
            <div class="style-858">...</div>
            <div class="style-884">...</div>
        </div>
    </div>
</div>

Component & Styling Breakdown:

Layout (.style-809):

display: grid; grid-template-columns: 303px 303px 303px 303px;: Creates four equal-width columns.

The first column (newsletter) is visually separated and occupies a different part of the grid in the original design.

Link Lists (<ul>):

The lists of links (.style-837, .style-862, etc.) have list-style: outside none none; and padding-left: 0px; to remove default bullet points and indentation.

Footer links (.style-839, etc.) are styled with a muted color, color: rgb(115, 107, 107);, and have a transition for a subtle hover effect.

Newsletter Form (.style-819):

The email input (.style-820) and the submit button (.style-821) are styled to appear as a single, cohesive unit. This is achieved by giving the input a border-radius only on the left (30px 0px 0px 30px) and the button a border-radius only on the right (0px 30px 30px 0px).

Social Media Icons (.style-826):

Each icon is an <a> tag with a background-color: rgb(45, 35, 35); and border-radius: 100px; to create the circular shape. They are flex containers that center the SVG icon within.`
    },
    {
      id: 2,
      company: 'Cluely',
      description: 'Elegant analytics dashboard with perfect data visualization',
      image: '/designinspoimages/cluely1.png',
      logo: '/designinspoimages/cluelylogo.jpg',
      images: [
        '/designinspoimages/cluely1.png',
        '/designinspoimages/cluely2.png',
        '/designinspoimages/cluely3.png',
        '/designinspoimages/cluely4.png',
        '/designinspoimages/cleuly5.png',
        '/designinspoimages/cluely6.png',
        '/designinspoimages/cluely7.png'
      ],
      prompt: prefixText + `This landing page exemplifies modern web design principles with a sophisticated, premium aesthetic. The design leverages a combination of subtle gradients, strategic use of negative space, and a refined color palette transitioning from light to dark themes. The implementation utilizes Next.js with React components, Tailwind CSS for utility-first styling, and demonstrates advanced CSS techniques including backdrop filters, complex gradients, and smooth transitions.
Key Design Characteristics:

Visual Hierarchy: Clear content flow with distinct sections
Color Strategy: Gradient-heavy design with blue/purple accent colors
Typography: Clean, modern sans-serif with careful weight variations
Spacing: Generous padding and margins creating breathing room
Interactive Elements: Subtle hover states and micro-animations
Responsive Design: Mobile-first approach with breakpoint-specific layouts


Section-by-Section Breakdown
1. Navigation Header
Structure & Layout:

Fixed positioning with transparent background
Flexbox layout with three-part structure: logo (left), navigation links (center), CTA buttons (right)
Max-width constraint (76rem) with automatic centering
Responsive behavior: hamburger menu on mobile, full navigation on desktop

Styling Specifications:
css- Position: fixed, top-0, w-full, z-[12]
- Background: transparent with transition effects
- Padding: p-3 lg:p-2
- Typography: text-sm/6 (14px with 1.5 line height)
- Font-weight: 600 (semibold)
Interactive Elements:

Navigation links: border-b border-transparent hover:border-black (underline on hover)
CTA button: Black background with rounded-full, hover opacity change
Logo: SVG icon with size-4 (16px) paired with text

Color Palette:

Text: zinc-900 (#18181b)
CTA Background: black (#000000)
CTA Text: white (#ffffff)

2. Hero Section
Structure & Layout:

Relative positioning with extensive vertical padding
Centered text content with max-width constraints
Layered gradient background effects
Absolute positioned UI mockup at bottom

Background Design:
css- Primary gradient: bg-gradient-to-t from-blue-100 to-blue-200
- Multiple layered blur effects with increasing radius
- Clip-path polygon for organic shape overlay
- Shadow effects: rgba(173,216,255,0.5) with varying opacity
Typography:

Headline: text-4xl sm:text-7xl (responsive sizing)
Font-weight: 500 (medium)
Text-balance for optimal line breaks
Subheading: text-lg/6 lg:text-xl/6 with zinc-500 color

CTA Design:

Primary CTA: Black pill button with group hover effects
Icon integration with transition effects
Secondary link: Underlined text with hover color change
Platform-specific icons (Apple logo for Mac download)

Visual Effects:

Nested div containers creating concentric glow effects
Blur filters: blur-[1px] to blur-[4px] progressive blurring
Absolute positioned mockup with pointer-events-none

3. Feature Showcase Section
Structure & Layout:

Three-part layout: header + 2-column grid + full-width feature
Border-based design system with zinc-200 borders
Responsive grid: lg:grid-cols-2 with stack on mobile

Section Header:
css- Uppercase label: text-lg/10, font-base, text-zinc-500
- Main heading: text-4xl sm:text-5xl, font-medium
- Centered alignment with max-width constraint
Feature Cards:

Image-first design with text overlay at bottom
Blue accent bar: bg-[#0055FE] w-1 h-8.5
Typography hierarchy: h2 (text-2xl) + p (text-base, text-zinc-600)
Positioning: absolute text placement over images

Grid System:

Border integration: lg:border-y border-zinc-200 lg:divide-x
Consistent spacing with strategic negative margins
Pointer-events-none for non-interactive elements

4. Testimonial/Quote Section
Structure & Layout:

Simple centered layout with generous vertical padding
Border-x creating visual containment
Minimal design focusing on typography

Typography:

Quote: text-4xl sm:text-5xl with quotation marks
Font-weight: 500 (medium)
Strategic use of text-balance
CTA button maintaining consistent pill shape design

5. Dark Feature Section
Structure & Layout:

Full-width dark background: bg-[#181B20]
Three-column feature layout with alternating image placement
Consistent spacing: py-16 between features

Color Scheme:

Background: Dark charcoal (#181B20)
Text: White headings, zinc-300/400 for body text
Image backgrounds: bg-[#1D2025] with ring-1 ring-white/5

Component Pattern:
css- Grid: grid-cols-1 lg:grid-cols-5
- Text sections: col-span-2
- Image sections: col-span-3
- Alternating order with lg:order-1/2
Visual Treatment:

Rounded corners: rounded-[18px]
Subtle ring border for depth
Consistent image aspect ratios

6. Scrolling Feature Section
Structure & Layout:

Sticky sidebar pattern for desktop
Sequential content reveal on scroll
Mobile: Linear stack with inline images

Implementation Details:
css- Sidebar: md:sticky md:top-0 md:h-screen
- Content: will-change: transform (scroll optimization)
- Image transitions: opacity-based crossfade
7. Final CTA Section
Structure & Layout:

Full-screen hero-style section
Background image with overlay
Centered content with CTAs

Visual Effects:

Absolute positioned background image
Text overlay with high contrast
Maintained button consistency from hero

8. Footer
Structure & Layout:

Multi-level footer with black background
Grid-based link organization
Compliance badges and social links
Unique animated bottom border

Grid System:
css- Main grid: lg:grid-cols-4 for link sections
- Compliance section with flex layout
- Social icons in horizontal arrangement
Unique Elements:

Animated bottom stripes (increasing height)
Download link for brand assets
Status indicator with live system status
Comprehensive legal/compliance section

Technical Implementation Details
CSS Architecture

Utility-First: Extensive Tailwind CSS usage
Custom Properties: Specific brand colors (#0055FE, #181B20)
Responsive Utilities: Consistent lg: breakpoint usage
Advanced Techniques: backdrop-filter, clip-path, will-change

Animation & Transitions
css- Standard transition: transition duration-300
- Hover states: opacity changes, scale transforms
- Group hover patterns for complex interactions
- Spring easing: ease-spring custom timing function
Typography System

Font Family: System font stack (implicit)
Size Scale: text-xs through text-7xl
Line Height: Tailwind's relaxed scale (/6 ratios)
Weight Scale: 400 (normal) to 600 (semibold)

Color Palette
Primary Blues: blue-100, blue-200, #0055FE
Neutrals: zinc-200, zinc-300, zinc-400, zinc-500, zinc-600, zinc-900
Dark Theme: #181B20, #1D2025
Accents: Green-500 (status indicators)
Spacing System

Consistent use of Tailwind spacing scale
Section padding: py-32 to py-60
Component spacing: p-8, mt-8, gap-8
Micro-spacing: mt-2, gap-2 for tight layouts

Component Patterns

Pill Buttons: rounded-full, px-6/7.5, py-2.5/3
Cards: Border-based with absolute positioning
Icons: Consistent sizing with size-4/6 classes
Links: Underline on hover pattern
Sections: Max-width constraints with mx-auto

This design system demonstrates exceptional attention to detail with its layered visual effects, consistent component patterns, and sophisticated use of modern CSS capabilities. The implementation showcases best practices in responsive design, performance optimization, and maintainable code structure.


Global Design System
Typography Foundation
Font Stack:
cssfont-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
/* Custom font: Aeonik (loaded externally) */
Font Sizes & Line Heights:
css/* Text Size Classes Used */
text-xs: 12px
text-sm: 14px
text-base: 16px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
text-3xl: 30px
text-4xl: 36px
text-5xl: 48px
text-6xl: 60px
text-7xl: 72px

/* Line Height Ratios */
/6: 1.5 line-height ratio
/10: 2.5 line-height ratio
leading-5: 1.25rem
leading-6: 1.5rem
Font Weights:
cssfont-base: 400
font-medium: 500
font-semibold: 600
Color Palette
Primary Colors:
css/* Blues */
blue-100: #dbeafe
blue-200: #bfdbfe
blue-600: #2563eb
#0055FE: Custom brand blue

/* Neutrals */
zinc-200: #e4e4e7
zinc-300: #d4d4d8
zinc-400: #a1a1aa
zinc-500: #71717a
zinc-600: #52525b
zinc-700: #3f3f46
zinc-900: #18181b

/* Dark Theme */
#181B20: Primary dark background
#1D2025: Secondary dark background
#282828: Tertiary dark

/* Accent Colors */
green-500: #22c55e (status indicators)
sky-50: #f0f9ff (hover states)
sky-300: #7dd3fc
Spacing System
css/* Padding/Margin Scale */
0: 0px
0.5: 2px
1: 4px
2: 8px
2.5: 10px
3: 12px
4: 16px
5: 20px
6: 24px
8: 32px
10: 40px
12: 48px
16: 64px
18: 72px
20: 80px
26: 104px
32: 128px
36: 144px
48: 192px
60: 240px
65: 260px
Breakpoint System
css/* Responsive Breakpoints */
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px

Navigation Header
HTML Structure:
html<div class="mx-auto fixed flex left-0 right-0 top-0 w-full z-[12] items-center justify-between max-w-[76rem] select-none transition-all duration-300 ease-spring bg-transparent lg:mt-5 translate-y-0">
  <header class="relative isolate w-full">
    <nav class="flex items-center justify-between p-3 lg:p-2">
      <!-- Logo Section -->
      <div class="flex lg:flex-1 ml-2 -mt-0.5">
        <a class="flex items-center gap-x-0.5 transition border-b border-transparent hover:border-black">
          <svg class="transition size-4 mt-1">...</svg>
          <span class="mt-1.5 text-lg font-medium transition">Cluely</span>
        </a>
      </div>
      
      <!-- Mobile Menu -->
      <div class="flex lg:hidden">
        <button class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-zinc-700">
          <span class="sr-only">Open main menu</span>
          <svg class="size-5.5 mr-1 outline-none">...</svg>
        </button>
      </div>
      
      <!-- Desktop Navigation -->
      <div class="hidden lg:flex lg:gap-x-12 -ml-12">
        <a class="text-sm/6 font-semibold text-zinc-900 transition border-b border-transparent hover:border-black">Use cases</a>
        <!-- More links... -->
      </div>
      
      <!-- CTA Section -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-x-5">
        <a class="text-sm/6 font-semibold text-zinc-900 transition border-b border-transparent hover:border-black">Log in</a>
        <a class="flex px-2 py-1 gap-x-1 text-sm/6 font-semibold rounded-full text-white bg-black hover:opacity-86">
          Sign up
          <svg width="20" height="21">...</svg>
        </a>
      </div>
    </nav>
  </header>
</div>
Detailed Styling Breakdown:
Container Styles:
css/* Positioning & Layout */
position: fixed
left: 0
right: 0
top: 0
z-index: 12
width: 100%
max-width: 76rem (1216px)
margin: 0 auto

/* Responsive Behavior */
@media (min-width: 1024px) {
  margin-top: 20px
}

/* Transitions */
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)
background: transparent
transform: translateY(0)
Logo Styling:
css/* Container */
display: flex
align-items: center
gap: 2px
margin-left: 8px
margin-top: -2px

/* Icon */
width: 16px
height: 16px
margin-top: 4px
transition: all 150ms

/* Text */
font-size: 18px
font-weight: 500
margin-top: 6px
Navigation Links:
css/* Base Style */
font-size: 14px
line-height: 1.5
font-weight: 600
color: #18181b
border-bottom: 1px solid transparent
transition: all 150ms

/* Hover State */
&:hover {
  border-color: black
}
CTA Button:
css/* Layout */
display: flex
align-items: center
gap: 4px
padding: 4px 8px

/* Style */
background: black
color: white
border-radius: 9999px
font-size: 14px
font-weight: 600

/* Hover */
&:hover {
  opacity: 0.86
}

/* Arrow Icon */
width: 20px
height: 21px
fill: #282828

Hero Section
HTML Structure:
html<div class="relative py-32 sm:py-48 lg:py-60 select-none bg-gradient-to-t from-blue-100 to-blue-200">
  <!-- Background Effects -->
  <div class="hidden lg:block">
    <div class="absolute inset-0 overflow-hidden contain-paint">
      <div class="absolute inset-[0.5rem] rounded-[12rem] bg-white/2 shadow-[0_0_40px_rgba(173,216,255,0.5)] blur-[4px]"></div>
      <div class="absolute inset-[3rem] rounded-[12rem] bg-white/2 shadow-[0_0_30px_rgba(173,216,255,0.4)] blur-[3px]"></div>
      <div class="absolute inset-[6rem] rounded-[12rem] bg-white/2 shadow-[0_0_20px_rgba(173,216,255,0.3)] blur-[2px]"></div>
      <div class="absolute inset-[10rem] rounded-[8rem] bg-white/2 shadow-[inset_0_0_30px_rgba(255,255,255,0.4)] blur-[1px]"></div>
    </div>
  </div>
  
  <!-- Organic Shape Overlay -->
  <div aria-hidden="true" class="absolute inset-x-0 top-1/2 transform -translate-y-1/2 overflow-hidden blur-3xl">
    <div style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
  </div>
  
  <!-- Content -->
  <div class="relative text-center z-[1] mx-auto max-w-3xl lg:pb-16">
    <h1 class="text-4xl font-medium tracking-tight text-balance text-zinc-900 sm:text-7xl">
      AI that helps before you even ask.
    </h1>
    <p class="mx-auto max-w-xl mt-5 text-lg/6 lg:text-xl/6 font-medium text-balance text-zinc-500">
      Cluely uses your screen and audio to provide intelligence during meetings, sales calls, and everything on your computer.
    </p>
    
    <!-- CTAs -->
    <div class="grid items-center justify-center gap-y-2.5 mt-10">
      <a class="flex group items-center gap-x-2 rounded-full bg-black px-7.5 py-3 text-md font-semibold text-white shadow-xs outline-none hover:-translate-y-0.5 transition hover:scale-[100.5%] hover:bg-black/90">
        <svg class="mb-0.5 group-hover:text-sky-50 transition">...</svg>
        <span class="group-hover:text-sky-50 transition">Download for Mac</span>
      </a>
      <a class="text-sm/6 font-semibold text-zinc-900/60 hover:text-blue-600/80 underline">
        Download for Windows
      </a>
    </div>
  </div>
  
  <!-- UI Mockup -->
  <div class="hidden z-[11] lg:block absolute -bottom-[11.5rem] left-1/2 transform -translate-x-1/2 z-[1] max-w-2xl pointer-events-none">
    <img src="/_next/static/media/frame.e956ee74.webp" alt="cluely-ui" />
  </div>
</div>
Detailed Styling Breakdown:
Background Gradient:
cssbackground: linear-gradient(to top, #dbeafe, #bfdbfe)
Layered Glow Effects:
css/* Layer 1 - Outermost */
position: absolute
inset: 0.5rem (8px from all edges)
border-radius: 12rem (192px)
background: rgba(255, 255, 255, 0.02)
box-shadow: 0 0 40px rgba(173, 216, 255, 0.5)
filter: blur(4px)

/* Layer 2 */
inset: 3rem (48px)
box-shadow: 0 0 30px rgba(173, 216, 255, 0.4)
filter: blur(3px)

/* Layer 3 */
inset: 6rem (96px)
box-shadow: 0 0 20px rgba(173, 216, 255, 0.3)
filter: blur(2px)

/* Layer 4 - Innermost */
inset: 10rem (160px)
border-radius: 8rem (128px)
box-shadow: inset 0 0 30px rgba(255, 255, 255, 0.4)
filter: blur(1px)
Typography Specifications:
css/* Headline */
font-size: 36px (mobile) / 72px (desktop)
font-weight: 500
letter-spacing: -0.025em
text-wrap: balance
color: #18181b

/* Subheading */
font-size: 18px / 20px (desktop)
line-height: 1.5
font-weight: 500
color: #71717a
max-width: 36rem (576px)
margin-top: 20px
CTA Button Detailed:
css/* Primary Button */
display: flex
align-items: center
gap: 8px
padding: 12px 30px
background: black
color: white
border-radius: 9999px
font-weight: 600
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05)
transition: all 150ms

/* Hover States */
&:hover {
  transform: translateY(-2px)
  scale: 1.005
  background: rgba(0, 0, 0, 0.9)
}

/* Group Hover Effects */
.group:hover svg,
.group:hover span {
  color: #f0f9ff
}

Feature Showcase Section
HTML Structure:
html<div class="mx-auto max-w-7xl pt-20 lg:pt-65 select-none lg:border-x border-zinc-200 overflow-hidden">
  <!-- Section Header -->
  <div class="mx-auto max-w-2xl sm:text-center px-5 lg:px-0">
    <h2 class="text-lg/10 font-base text-zinc-500 uppercase">The turning point of thought</h2>
    <p class="mt-2 text-4xl font-medium tracking-tight text-pretty text-black sm:text-5xl sm:text-balance">
      Cluely helps with anything it sees or hears.
    </p>
  </div>
  
  <!-- Two Column Grid -->
  <div class="grid lg:grid-cols-2 mt-20 mb-16 lg:mb-0 pointer-events-none lg:border-y border-zinc-200 lg:divide-x divide-zinc-200">
    <!-- Feature 1 -->
    <div class="relative">
      <img src="/_next/static/media/bento1.3b364800.png" alt="Sees what you see" />
      <div class="lg:absolute px-8 -mt-36 lg:mt-0 lg:pl-0 bottom-16 left-10 w-full lg:w-auto">
        <h2 class="text-2xl font-medium break-words">Sees what you see</h2>
        <p class="w-full lg:w-100 mt-3 text-base leading-5 text-zinc-600 break-words">
          Cluely sees and understands all the content on your screen — code, slides, questions, docs, dashboards.
        </p>
      </div>
      <div class="hidden lg:block absolute bg-[#0055FE] w-1 h-8.5 bottom-28.5 -left-[1px]"></div>
    </div>
    <!-- Feature 2 similar structure -->
  </div>
  
  <!-- Full Width Feature -->
  <div class="relative pointer-events-none lg:border-b border-zinc-200">
    <!-- Similar structure -->
  </div>
</div>
Detailed Styling Breakdown:
Container Specifications:
css/* Main Container */
max-width: 80rem (1280px)
margin: 0 auto
padding-top: 80px (mobile) / 260px (desktop)
overflow: hidden

/* Border System */
@media (min-width: 1024px) {
  border-left: 1px solid #e4e4e7
  border-right: 1px solid #e4e4e7
}
Section Header:
css/* Label */
font-size: 18px
line-height: 2.5
text-transform: uppercase
color: #71717a
font-weight: 400

/* Title */
font-size: 36px (mobile) / 48px (desktop)
font-weight: 500
letter-spacing: -0.025em
text-wrap: pretty / balance
color: black
margin-top: 8px
Feature Card Layout:
css/* Grid Container */
display: grid
grid-template-columns: 1fr (mobile) / repeat(2, 1fr) (desktop)
margin-top: 80px
margin-bottom: 64px (mobile) / 0 (desktop)

/* Borders */
@media (min-width: 1024px) {
  border-top: 1px solid #e4e4e7
  border-bottom: 1px solid #e4e4e7
  
  /* Divider between columns */
  > * + * {
    border-left: 1px solid #e4e4e7
  }
}
Feature Content Positioning:
css/* Text Container */
position: absolute (desktop) / relative (mobile)
padding: 32px
margin-top: -144px (mobile adjustment)
bottom: 64px
left: 40px
width: 100% (mobile) / auto (desktop)

/* Typography */
h2 {
  font-size: 24px
  font-weight: 500
  word-break: break-words
}

p {
  width: 100% (mobile) / 400px (desktop)
  margin-top: 12px
  font-size: 16px
  line-height: 1.25
  color: #52525b
}
Blue Accent Bar:
cssposition: absolute
background: #0055FE
width: 4px
height: 34px
bottom: 114px
left: -1px

Quote Section
Detailed Styling:
css/* Container */
max-width: 80rem
margin: 0 auto
padding: 144px 0
text-align: center
border-left: 1px solid #e4e4e7
border-right: 1px solid #e4e4e7

/* Quote Text */
font-size: 36px (mobile) / 48px (desktop)
font-weight: 500
letter-spacing: -0.025em
text-wrap: pretty / balance
color: black

/* CTA Link */
display: flex
align-items: center
gap: 8px
width: 160px
margin: 32px auto 0
padding: 10px 24px
background: black
color: white
border-radius: 9999px
font-size: 18px
font-weight: 600
transition: all 150ms

&:hover {
  transform: translateY(-2px) scale(1.005)
  background: rgba(0, 0, 0, 0.9)
}

Dark Feature Section
HTML Structure:
html<div class="bg-[#181B20]">
  <div class="mx-auto max-w-6xl sm:text-center pt-18 lg:pt-26">
    <!-- Header -->
    <div class="max-w-80 mx-auto lg:max-w-6xl">
      <h2 class="mt-2 text-3xl lg:text-5xl font-medium tracking-tight text-white sm:text-5xl sm:text-balance">
        Undetectable by design.
      </h2>
      <p class="mt-4 text-lg lg:text-xl max-w-lg mx-auto font-base tracking-tight text-zinc-400 leading-6">
        No bots in the room. No Zoom guests. No screen-share trails. Works on everything.
      </p>
    </div>
    
    <!-- Logo Grid -->
    <img src="/_next/static/media/works.2bbce57b.png" class="h-46 lg:h-50 mt-8 mx-auto" />
    
    <!-- Features -->
    <div class="mt-12 select-none pointer-events-none">
      <!-- Feature Pattern -->
      <div class="py-16 mx-auto grid grid-cols-1 gap-x-12 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-5 items-center">
        <div class="lg:pr-8 pl-8 lg:pl-0 col-span-2">
          <h2 class="text-2xl font-medium tracking-tight text-white mb-4">Doesn't join meetings</h2>
          <p class="text-base text-zinc-300">Description text...</p>
        </div>
        <div class="lg:order-2 col-span-3 p-8 lg:p-0 -mt-14 lg:mt-0">
          <img class="bg-[#1D2025] rounded-[18px] w-full max-w-none ring-1 ring-white/5" />
        </div>
      </div>
    </div>
  </div>
</div>
Detailed Dark Theme Styling:
Background Colors:
css/* Primary Background */
background: #181B20

/* Secondary Background (images) */
background: #1D2025

/* Ring Border */
box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.05)
Typography in Dark Mode:
css/* Headings */
color: white
font-size: 24px (feature) / 30px-48px (main)
font-weight: 500
letter-spacing: -0.025em

/* Body Text */
color: #d4d4d8 (zinc-300)
font-size: 16px
line-height: 1.5

/* Subtle Text */
color: #a1a1aa (zinc-400)
Grid Layout Pattern:
css/* Container */
display: grid
grid-template-columns: 1fr (mobile) / repeat(5, 1fr) (desktop)
gap: 48px (x-axis) / 64px-80px (y-axis)
padding: 64px 0
align-items: center

/* Text Column */
grid-column: span 2
padding-right: 32px (desktop)
padding-left: 32px (mobile)

/* Image Column */
grid-column: span 3
padding: 32px (mobile) / 0 (desktop)
margin-top: -56px (mobile) / 0 (desktop)

/* Alternating Layout */
.lg:order-1 (image first on desktop)
.lg:order-2 (text first on desktop)

Scrolling Feature Section
HTML Structure:
html<div class="mx-auto max-w-7xl pt-32 select-none pointer-events-none border-x border-zinc-200">
  <h1 class="text-4xl font-medium max-w-md ml-8 lg:-mb-12">
    Three ways Cluely changes how you think.
  </h1>
  
  <div class="flex flex-col md:flex-row">
    <!-- Sticky Image Container -->
    <div class="w-full md:w-3/5 md:sticky md:top-0 md:h-screen flex items-center justify-center">
      <div class="relative w-full h-full flex items-center justify-center">
        <!-- Multiple images with opacity transitions -->
        <div class="absolute w-full h-full flex items-center justify-center transition-opacity duration-500 opacity-100 z-10">
          <img class="max-w-full max-h-full object-contain rounded-r-[18px] border-r border-y border-zinc-200/70" />
        </div>
        <!-- More images... -->
      </div>
    </div>
    
    <!-- Scrolling Content -->
    <div class="w-full md:w-1/2 md:ml-auto">
      <div style="will-change: transform;">
        <div class="max-w-xl">
          <div class="p-8 lg:pl-20">
            <h2 class="text-5xl font-medium mb-4">Meetings</h2>
            <p class="text-xl text-zinc-600 max-w-94">Description...</p>
          </div>
          <div class="h-80 md:hidden mt-6 flex items-center justify-center">
            <img class="max-h-full object-contain" />
          </div>
        </div>
      </div>
      <!-- More sections... -->
    </div>
  </div>
</div>
Sticky Scroll Implementation:
css/* Sticky Container */
@media (min-width: 768px) {
  position: sticky
  top: 0
  height: 100vh
  width: 60%
}

/* Image Transitions */
.image-container {
  position: absolute
  width: 100%
  height: 100%
  display: flex
  align-items: center
  justify-content: center
  transition: opacity 500ms
  
  /* Active state */
  &.active {
    opacity: 1
    z-index: 10
  }
  
  /* Inactive state */
  &:not(.active) {
    opacity: 0
    z-index: 0
  }
}

/* Content Optimization */
will-change: transform

Final CTA Section
Detailed Styling:
css/* Container */
position: relative
max-width: 80rem
margin: 40px auto 0 (mobile) / 0 auto (desktop)
padding: 240px 0
border: 1px solid #e4e4e7

/* Background Image */
position: absolute
height: 100%
width: 100%
inset: 0
object-fit: cover
z-index: 0

/* Content */
position: relative
z-index: 1
margin-left: 32px (mobile) / 0 (desktop)
text-align: left (mobile) / center (desktop)

/* Typography */
.label {
  text-transform: uppercase
  color: #71717a
  letter-spacing: -0.025em
  font-size: 18px
}

.heading {
  margin-top: 8px
  font-size: 48px (mobile) / 60px (desktop)
  font-weight: 500
  letter-spacing: -0.025em
  text-wrap: balance
  color: #18181b
}

Footer
HTML Structure:
html<footer class="bg-black text-white select-none md:h-screen flex flex-col justify-between">
  <!-- Main Content -->
  <div class="w-full flex flex-col items-center justify-center px-4 pt-8">
    <div class="w-full max-w-[1000px]">
      <!-- Logo Section -->
      <div class="grid grid-cols-1 items-end gap-8 font-mono text-sm lg:grid-cols-[1fr_3fr_346px] lg:gap-0">
        <div class="flex flex-col justify-start space-y-4 lg:space-y-8 mt-4 mb-8">
          <div class="size-16 flex items-center justify-center">
            <svg class="transition mt-1 size-16">...</svg>
          </div>
          <a class="text-zinc-400" download="cluely-logo.svg">└ cluely-logo.svg</a>
        </div>
      </div>
      
      <!-- Links Grid -->
      <div class="grid grid-cols-2 gap-8 lg:gap-16 text-sm lg:grid-cols-4">
        <ul class="space-y-3">
          <li class="font-mono text-zinc-400 text-xs uppercase tracking-wider">GET STARTED</li>
          <li><a class="text-zinc-300 hover:text-white transition-colors">Sign up</a></li>
          <!-- More links... -->
        </ul>
        <!-- More columns... -->
      </div>
      
      <!-- Compliance Section -->
      <div class="inline-flex flex-col space-y-3.5">
        <div class="flex space-x-8 pt-8">
          <!-- Compliance badges -->
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="flex flex-col justify-between gap-8 lg:flex-row lg:gap-0 border-t border-dashed border-zinc-700 mt-6 pt-5">
        <!-- Status Links -->
        <div class="grid lg:grid-cols-3 space-y-1 text-xs">
          <a class="group flex items-center space-x-2 py-1 text-white hover:text-zinc-300">
            <span class="text-green-500 group-hover:text-sky-300">
              <svg width="10" height="10">...</svg>
            </span>
            <span>Status: All Systems Operational</span>
          </a>
          <!-- More links... -->
        </div>
        
        <!-- Social Icons -->
        <div class="flex space-x-2 text-white">
          <!-- Social links -->
        </div>
      </div>
    </div>
  </div>
  
  <!-- Animated Bottom Border -->
  <div aria-hidden="true" style="overflow: hidden; height: 200px">
    <div style="margin-top: 0px">
      <div style="height: 1px; background-color: #ffffff; transition: transform 0.1s ease; will-change: transform; margin-top: -2px"></div>
      <!-- More lines with increasing height... -->
    </div>
  </div>
</footer>
Footer Styling Details:
Layout Structure:
css/* Container */
background: black
color: white
display: flex
flex-direction: column
justify-content: space-between
min-height: 100vh (desktop)

/* Content Wrapper */
max-width: 1000px
margin: 0 auto
padding: 32px 16px
Typography System:
css/* Section Headers */
font-family: monospace
font-size: 12px
text-transform: uppercase
letter-spacing: 0.1em
color: #a1a1aa

/* Links */
font-size: 14px
color: #d4d4d8
transition: color 150ms

&:hover {
  color: white
}

/* Status Indicators */
font-size: 12px
display: flex
align-items: center
gap: 8px

/* Icon Color Transitions */
.group:hover .icon {
  color: #7dd3fc (sky-300)
}
Animated Bottom Effect:
css/* Container */
overflow: hidden
height: 200px

/* Individual Lines */
@for $i from 1 through 23 {
  .line-#{$i} {
    height: #{$i}px
    background-color: white
    transition: transform 100ms ease
    will-change: transform
    margin-top: -2px
  }
}

Cookie Banner
Detailed Implementation:
css/* Container */
position: fixed
bottom: 20px
left: 50%
transform: translateX(-50%) translateX(-450px) /* Off-screen initially */
max-width: 900px
width: calc(100vw - 40px)
padding: 12px 20px
background: white
border-radius: 34px
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08)
backdrop-filter: blur(8px)
z-index: 999999
transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms

/* Layout */
display: flex
align-items: center
gap: 16px
flex-wrap: nowrap

/* Icon Container */
flex-shrink: 0
width: 20px
height: 20px

/* Text Content */
flex: 1 1 0%
min-width: 200px
font-size: 12px
line-height: 1.3
color: #6b7280

/* Buttons Container */
display: flex
gap: 6px
flex-shrink: 0

/* Button Styles */
.reject-button {
  background: #f9fafb
  color: #6b7280
  padding: 8px 16px
  font-size: 12px
  font-weight: 500
  border-radius: 17px
  min-height: 32px
}

.accept-button {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)
  color: white
  padding: 8px 20px
  font-size: 12px
  font-weight: 500
  border-radius: 17px
  min-height: 32px
}

/* Progress Bar */
position: absolute
bottom: 0
left: 0
right: 0
height: 3px
background: rgba(0, 0, 0, 0.1)
border-radius: 0 0 50px 50px
overflow: hidden
opacity: 0
transition: opacity 300ms

.progress-fill {
  height: 3px
  background: #3b82f6
  width: 0%
  transition: width linear
  border-radius: 0 0 50px 50px
}

Animation & Interaction Patterns
Global Transition Patterns:
css/* Standard Transition */
transition: all 150ms ease

/* Spring Easing */
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)

/* Hover Lift Effect */
&:hover {
  transform: translateY(-2px)
  scale: 1.005
}

/* Opacity Transitions */
transition: opacity 500ms ease

/* Color Transitions */
transition: color 150ms, background-color 150ms
Interactive States:
css/* Link Underline Pattern */
border-bottom: 1px solid transparent
transition: border-color 150ms

&:hover {
  border-color: currentColor
}

/* Group Hover Pattern */
.group:hover .group-hover\:text-sky-50 {
  color: #f0f9ff
}

/* Scale Animations */
transform: scale(1)
transition: transform 150ms

&:hover {
  transform: scale(1.005)
}

/* Pointer Events Control */
pointer-events: none /* For non-interactive decorative elements */
Performance Optimizations:
css/* Will-change for scroll animations */
will-change: transform

/* Contain paint for performance */
contain: paint

/* Select-none for non-selectable UI */
user-select: none
- Fixed positioning with transparent background
- Flexbox layout with three-part structure: logo (left), navigation links (center), CTA buttons (right)
- Max-width constraint (76rem) with automatic centering
- Responsive behavior: hamburger menu on mobile, full navigation on desktop

Styling Specifications:
- Position: fixed, top-0, w-full, z-[12]
- Background: transparent with transition effects
- Padding: p-3 lg:p-2
- Typography: text-sm/6 (14px with 1.5 line height)
- Font-weight: 600 (semibold)

Interactive Elements:
- Navigation links: border-b border-transparent hover:border-black (underline on hover)
- CTA button: Black background with rounded-full, hover opacity change
- Logo: SVG icon with size-4 (16px) paired with text

Color Palette:
- Text: zinc-900 (#18181b)
- CTA Background: black (#000000)
- CTA Text: white (#ffffff)

2. Hero Section
Layout Architecture
.hero-section {
  padding-top: 144px;
  padding-bottom: 125px;
  background-image: url('texture-headline.webp');
  background-position: 100% -33%;
  background-size: 95.5%;
}

.hero-content {
  display: flex;
  gap: 34.6px;
  max-width: 1240px;
  margin: 0 auto;
}

Typography Hierarchy
Headline:
- Font: "Ggsans" (custom font)
- Size: 48px
- Line-height: 1.2
- Color: #FFFFFF
- Text-transform: uppercase for emphasis

Subheading:
- Size: 20px
- Line-height: 1.4
- Color: rgba(255, 255, 255, 0.8)
- Max-width: 491px for optimal readability

Visual Elements
- Background texture: Subtle gradient mesh overlay
- Floating decorative elements: Star shapes with parallax effect
- Device mockups: 3D perspective transforms
- Character illustrations: Positioned absolutely with animation

CTA Buttons
.cta-button {
  padding: 16px 32px;
  border-radius: 28px;
  font-size: 20px;
  font-weight: 500;
  background-color: #FFFFFF;
  color: #000000;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

3. Feature Sections
Grid-Based Layout
.feature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  align-items: center;
  padding: 120px 0;
}

/* Alternating layout */
.feature-section:nth-child(even) {
  direction: rtl;
}

Content Cards
- Background: Semi-transparent with blur effect
- Border-radius: 24px
- Padding: 40px
- Shadow: Multi-layered for depth
box-shadow: 
  0 0 0 1px rgba(255, 255, 255, 0.1),
  0 8px 32px rgba(0, 0, 0, 0.2),
  0 24px 64px rgba(0, 0, 0, 0.1);

Media Presentation
Screenshot containers:
- Aspect ratio: 16:9
- Border-radius: 16px
- Overflow: hidden for clean edges

- Device frames: Custom SVG overlays
- Hover effects: Scale transform on interaction

4. Animation System
Decorative Elements
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.floating-element {
  animation: float 6s ease-in-out infinite;
  animation-delay: var(--delay);
}

Scroll-Triggered Animations
- Intersection Observer implementation for performance
- Staggered delays for sequential reveals
- Transform origins carefully set for natural motion

Micro-Interactions
.interactive-element {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.interactive-element:active {
  transform: scale(0.95);
}

5. Typography System
Font Stack
--font-primary: "Ggsans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-display: "ABC Ginto Normal", var(--font-primary);
--font-mono: "Consolas", "Monaco", monospace;

Type Scale
- Display: 56px / 1.1 line-height
- Headline: 48px / 1.2 line-height
- Title: 32px / 1.3 line-height
- Body Large: 20px / 1.5 line-height
- Body: 16px / 1.6 line-height
- Caption: 14px / 1.4 line-height

Text Styling
.text-gradient {
  background: linear-gradient(135deg, #5865F2 0%, #EB459E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

6. Color System
Primary Palette
:root {
  --color-primary: #5865F2;     /* Brand Purple */
  --color-secondary: #EB459E;   /* Brand Pink */
  --color-tertiary: #57F287;    /* Success Green */
  --color-danger: #ED4245;      /* Error Red */
  --color-warning: #FEE75C;     /* Warning Yellow */
}

Neutral Scale
:root {
  --gray-900: #0c0e10;  /* Deepest black */
  --gray-800: #1a1c1f;  /* Background dark */
  --gray-700: #2b2d31;  /* Surface dark */
  --gray-600: #313338;  /* Surface light */
  --gray-500: #41434a;  /* Border dark */
  --gray-400: #686a71;  /* Text muted */
  --gray-300: #9d9fa6;  /* Text secondary */
  --gray-200: #b5bac1;  /* Text primary */
  --gray-100: #dbdee1;  /* Border light */
  --gray-50: #f2f3f5;   /* Surface bright */
}

7. Responsive Design System
Breakpoint Strategy
/* Mobile First Approach */
@media (min-width: 640px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Wide */ }
@media (min-width: 1536px) { /* Ultra-wide */ }

Fluid Typography
.fluid-text {
  font-size: clamp(32px, 5vw, 56px);
  line-height: clamp(1.2, 1.1 + 0.1vw, 1.1);
}

Container Queries
.adaptive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(20px, 3vw, 40px);
}

8. Component Library
Button Variants
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 500;
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
}

/* Icon Button */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

Card Components
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

9. Footer Design
Structure
.footer {
  background: var(--gray-900);
  padding: 80px 0 24px;
  position: relative;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 40px;
  max-width: 1240px;
  margin: 0 auto;
}

Social Links
.social-links {
  display: flex;
  gap: 24px;
}

.social-link {
  width: 32px;
  height: 32px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.social-link:hover {
  opacity: 1;
}

10. Performance Optimizations
Image Loading
<img 
  loading="lazy"
  srcset="image-500w.webp 500w,
          image-800w.webp 800w,
          image-1200w.webp 1200w"
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
  alt="Description"
/>

CSS Architecture
/* Critical CSS inlined */
/* Non-critical CSS loaded asynchronously */
/* Component-specific CSS code-split */

Animation Performance
.will-animate {
  will-change: transform, opacity;
}

.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
}`
    },
    {
      id: 3,
      company: 'Airbnb',
      description: 'Warm, welcoming design with seamless booking experience',
      image: '/designinspoimages/airbnb1.png',
      logo: '/designinspoimages/airbnblogo.jpg',
      images: [
        '/designinspoimages/airbnb1.png',
        '/designinspoimages/airbnb2.png',
        '/designinspoimages/airbnb3.png',
        '/designinspoimages/airbnb4.png',
        '/designinspoimages/airbnb5.png'
      ],
      prompt: prefixText + `Executive Summary
This document provides a comprehensive analysis of a modern web application's design system, focusing on technical implementation details, visual standards, and component architecture. The design demonstrates a sophisticated approach to contemporary web design with emphasis on clean aesthetics, seamless user experience, and responsive functionality.
High-Level Design Overview
Design Philosophy
The website employs a minimalist, content-first design approach with sophisticated use of whitespace, subtle animations, and carefully crafted micro-interactions. The overall aesthetic prioritizes clarity, accessibility, and modern web standards.
Core Visual Principles

Clean, geometric layouts with consistent grid systems
Subtle elevation and depth through strategic use of shadows and borders
Progressive disclosure of information with smooth transitions
Mobile-first responsive design with adaptive breakpoints
Accessibility-focused color contrast and semantic structure

Technology Stack Evidence

CSS-in-JS implementation using Linaria styling system
Component-based architecture with data attributes for testing
Advanced CSS Grid and Flexbox for layouts
Custom CSS properties for design tokens and theming
Sophisticated animation system with cubic-bezier timing functions


Detailed Design System Analysis
Typography System
Primary Font Stack
cssfont-family: 'Airbnb Cereal VF', Circular, -apple-system, 'system-ui', Roboto, 'Helvetica Neue', sans-serif
Font Smoothing & Rendering
css-webkit-font-smoothing: antialiased
font-synthesis: none
Typography Scale

Body Text: 14px (base) with 20.02px line-height
Small Text: 12px with 16px line-height
Medium Text: 16px with 20px line-height
Large Text: 18px with 24px/28px line-height
Headings: Range from 22px to 72px with negative letter-spacing

Letter Spacing System
css/* Negative letter spacing for larger text */
--typography-title-small22px-letter-spacing: -0.01375rem
--typography-title-medium26px-letter-spacing: -0.01625rem
--typography-title-large32px-letter-spacing: -0.04rem
--typography-special-display-medium_60_68-letter-spacing: -0.15rem
--typography-special-display-medium_72_74-letter-spacing: -0.18rem
Font Weight Hierarchy

Regular: 400 (body text, descriptions)
Medium: 500 (buttons, emphasis)
Semibold: 600 (subheadings)
Bold: 700 (main headings, CTA buttons)

Color System
Primary Color Palette
css/* Base Colors */
--primary-text: rgb(34, 34, 34)    /* #222222 */
--background-primary: rgb(255, 255, 255)    /* #FFFFFF */
--background-secondary: rgb(247, 247, 247)  /* #F7F7F7 */

/* Brand Colors */
--brand-primary: rgb(255, 56, 92)     /* #FF385C - Main brand color */
--brand-secondary: rgb(230, 30, 77)   /* #E61E4D */
--brand-gradient-start: rgb(230, 30, 77)
--brand-gradient-middle: rgb(227, 28, 95)
--brand-gradient-end: rgb(215, 4, 102)
Extended Color System
css/* Rausch Color Scale (Brand Reds) */
--rausch-100: #FFF8F9
--rausch-200: #FFEEF0
--rausch-300: #FEE5E7
--rausch-400: #FFD2D7
--rausch-500: #FFABB6
--rausch-600: #FF385C  /* Primary brand */
--rausch-700: #DA1249
--rausch-800: #A21039
--rausch-900: #732139
--rausch-1000: #361A21

/* Beige/Neutral Scale */
--beige-100: #F7F6F2
--beige-200: #F4F2EC
--beige-300: #EEEBE5
--beige-400: #DFDCD6
--beige-500: #C5C1BB
--beige-600: #8F8B87
--beige-700: #6E6A66
--beige-800: #53514E
--beige-900: #413F3D
--beige-1000: #232221
Border Colors
css--border-light: rgba(235, 235, 235, 0.8)  /* Subtle borders */
--border-standard: rgba(0, 0, 0, 0.08)    /* Standard borders */
Spacing & Layout System
Base Spacing Scale

4px: Micro-spacing for tight elements
8px: Small spacing between related elements
12px: Standard spacing for form elements
16px: Medium spacing for component separation
24px: Large spacing for section separation
32px: Extra large spacing
48px: Section padding
80px: Major section padding on desktop

Grid System
css/* 12-Column Grid */
grid-template-columns: repeat(12, 1fr)
column-gap: 16px

/* Content Max-Width Constraints */
max-width: 1440px  /* Standard content max-width */
max-width: 1920px  /* Footer max-width */
Responsive Breakpoints

Baseline (Mobile): 0-768px
Medium (Tablet): 768px-1024px
Large (Desktop): 1024px+

Border Radius System
css/* Subtle rounding for small elements */
border-radius: 2px   /* Links, small buttons */
border-radius: 8px   /* Standard buttons, cards */
border-radius: 12px  /* Icon containers */

/* Pills and rounded elements */
border-radius: 40px   /* Pill buttons */
border-radius: 1584px /* Full pill buttons */
border-radius: 1782px /* Large pill buttons */
Animation & Transition System
Standard Transitions
css/* Micro-interactions */
transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1)
transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1)
transition: opacity 0.2s cubic-bezier(0.2, 0, 0, 1)

/* Smooth content transitions */
transition: all 0.5s ease
transition: opacity 1.25s  /* Gradient animations */
Complex Animations
css/* Radial progress animations */
animation-duration: 0.7s
animation-iteration-count: infinite
animation-timing-function: cubic-bezier(0.1, 0.9, 0.2, 1)

/* Timeline-based animations */
animation-timeline: --app
animation-range: contain 0px contain 100px
Material Design Elements
Backdrop Filters
css/* Glassmorphism effects */
backdrop-filter: blur(10px)
background: rgba(255, 255, 255, 0.9)  /* Transparent white overlay */

/* Material background variants */
--material-extra-thin: rgba(218,218,218,0.40) blur(8px) saturate(1)
--material-thin: rgba(240,240,240,0.50) blur(36px) saturate(1.6)  
--material-regular: rgba(250,250,250,0.72) blur(24px) saturate(1.6)
--material-thick: rgba(240,240,240,0.86) blur(12px) saturate(3.00)
--material-extra-thick: rgba(255,255,255,0.925) blur(16px) saturate(1.6)

Section-by-Section Breakdown
Navigation Header
Structure & Layout
css/* Fixed header with glassmorphism */
position: fixed
top: 0px
left: 0px
width: 100%
height: 80px
z-index: 100

/* Backdrop blur effect */
backdrop-filter: blur(10px)
background: rgba(255, 255, 255, 0.9)
border-bottom: 1px solid rgba(235, 235, 235, 0.8)
Inner Container
csspadding: 0px 80px
margin: 0px auto
max-width: 1440px
display: flex
justify-content: space-between
align-items: center
height: 100%
Logo Section
css/* Logo container */
flex: 1 0 140px
width: 32px
overflow: hidden
color: rgb(255, 56, 92)  /* Brand color */

/* Logo link styling */
display: inline-flex
align-items: center
height: 80px
transition: color 0.25s cubic-bezier(0.2, 0, 0, 1)
Hero Section
Main Container
css/* Hero section background */
background: rgb(255, 255, 255)  /* Clean white background */
padding: 0px 80px 120px 80px    /* Large bottom padding */
margin: 0px auto
max-width: 1440px
Hero Title Styling
css/* Large display heading */
font-size: 60px
line-height: 64px
letter-spacing: -1.8px  /* Tight letter spacing */
font-weight: 700
color: rgb(34, 34, 34)
padding: 0px 0px 56px   /* Large bottom margin */
margin: 0px
Hero Description
cssfont-size: 18px
line-height: 28px
font-weight: 400
color: rgb(34, 34, 34)
max-width: 240px  /* Constrained width for readability */
Button System
Primary Button (CTA)
css/* Gradient button styling */
background: linear-gradient(to right, 
  rgb(230, 30, 77) 0%, 
  rgb(227, 28, 95) 50%, 
  rgb(215, 4, 102) 100%)
color: rgb(255, 255, 255)
border: 0px
border-radius: 8px
padding: 14px 24px
font-size: 16px
font-weight: 500
line-height: 20px

/* Interactive states */
transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1), 
           transform 0.1s cubic-bezier(0.2, 0, 0, 1)
cursor: pointer
touch-action: manipulation
Secondary Buttons
css/* Transparent buttons with hover states */
background: transparent
color: rgb(34, 34, 34)
border: 0px
border-radius: 8px
padding: 6px 8px
font-size: 14px
font-weight: 500

/* Hover state */
background-hover: rgb(247, 247, 247)  /* Light gray background */
Pill Buttons
css/* Fully rounded buttons */
border-radius: 1584px  /* Very large radius for pill effect */
padding: 14px 24px
background: rgb(34, 34, 34)  /* Dark background */
color: rgb(255, 255, 255)
Feature Cards Section
Container Structure
css/* Three-column grid on desktop */
display: grid
grid-template-columns: repeat(3, 1fr)
gap: 34px  /* Large gap between cards */
max-width: 968px
margin: 0px auto
padding: 0px 80px 120px
Individual Card Styling
css/* Card layout */
display: grid
grid-template-rows: 64px 56px  /* Icon area + text area */
align-items: flex-start
text-align: center
Icon Containers
css/* Circular icon backgrounds */
width: 48px
height: 48px
display: grid
place-items: center
background: rgb(247, 247, 247)
border-radius: 12px
color: rgb(34, 34, 34)
SVG Icon Styling
css/* Consistent icon sizing */
display: block
height: 32px
width: 32px
fill: currentColor  /* Inherits text color */
Footer Section
Main Footer Container
cssbackground: rgb(247, 247, 247)  /* Light gray background */
padding-left: 48px
padding-right: 48px
max-width: 1920px  /* Wider than content max-width */
margin: 0px auto
Footer Grid System
css/* 12-column grid system */
padding: 48px 0px
display: grid
grid-template-columns: repeat(12, minmax(0, 1fr))
column-gap: 16px
Footer Sections
css/* Each footer section spans 4 columns */
grid-column: span 4
padding-block: 0px
Footer Headings
cssmargin-top: 0px
margin-bottom: 16px
color: rgb(34, 34, 34)
font-size: 14px
line-height: 18px
font-weight: 500
Footer Links
css/* Clean link styling */
color: rgb(34, 34, 34)
text-decoration: none
font-size: 14px
background: transparent
border: 0px
border-radius: 2px  /* Subtle rounding */
font-weight: 400
line-height: 18px

/* Hover states */
cursor: pointer
transition: background-color 0.2s ease
Footer Lists
css/* Link list styling */
margin: 0px
padding: 0px
list-style: none
display: grid
gap: 16px  /* Consistent spacing between links */
Mobile Navigation Footer
Sticky Bottom Navigation
css/* Fixed bottom positioning */
position: fixed
bottom: 0px
left: 0px
right: 0px
z-index: 4

/* Glassmorphism effect */
background: rgba(255, 255, 255, 0.5)
backdrop-filter: blur(10px)
border-top: 1px solid rgba(235, 235, 235, 0.8)

/* Animation */
animation-name: slide-up
animation-duration: 0.5s
animation-timing-function: cubic-bezier(0.2, 0, 0, 1)
animation-delay: 2s
animation-fill-mode: backwards
Interactive Elements
Hover Effects
css/* Subtle transform on hover */
transform: scale(1.02)
transition: transform 0.1s cubic-bezier(0.2, 0, 0, 1)

/* Box shadow elevation */
box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15)
transition: box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1)
Progress Indicators
css/* Circular progress bars */
transform: matrix(0, -1, 1, 0, 0, 0)  /* Rotation transform */
transition: stroke-dashoffset 0.25s cubic-bezier(0, 0, 1, 1)
stroke-width: 2px
stroke-dasharray: 87.96459430051421
stroke-linecap: round
Accessibility Features
Screen Reader Support
css/* Visually hidden but accessible to screen readers */
clip: rect(0px, 0px, 0px, 0px)
clip-path: inset(100%)
height: 1px
overflow: clip
position: absolute
white-space: nowrap
width: 1px
Focus States
css/* High contrast focus indicators */
outline: rgb(34, 34, 34) none 0px
/* Custom focus styles implemented via :focus-visible */
Responsive Design Patterns
Mobile-First Approach
css/* Base styles for mobile */
padding: 16px 24px

/* Medium screens */
@media (min-width: 768px) {
  padding: 0px 40px 88px 40px
}

/* Large screens */
@media (min-width: 1024px) {
  padding: 0px 80px 120px 80px
}
Adaptive Grid Systems
css/* Mobile: Single column */
grid-template-columns: 1fr

/* Tablet: Flexible columns */
grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))

/* Desktop: Fixed 3-column */
grid-template-columns: repeat(3, 1fr)

Implementation Guidelines
CSS Custom Properties Usage
The design system extensively uses CSS custom properties for consistent theming:
css/* Typography variables */
--label_font-size: 1.125rem
--label_line-height: 1.75rem
--label_font-weight: 400

/* Spacing variables */
--section_padding: 0px 80px 120px 80px
--section_max-width: 1440px
--section_margin: 0 auto
Component Architecture
Each component follows a consistent data attribute pattern:
html<div data-element-name="component-name" data-variant="style-variant">
<div data-section-name="section-identifier">
<div data-static-id="unique-identifier">
Performance Optimizations

contain: strict for performance-critical elements
will-change: transform for animated elements
touch-action: manipulation for mobile optimization
content-visibility for large content areas

Testing & QA Attributes
Every interactive element includes testing attributes:
htmldata-testid="specific-test-identifier"
data-hook="functionality-hook"`
    },
    {
      id: 4,
      company: 'Discord',
      description: 'Modern chat interface with smooth user interactions',
      image: '/designinspoimages/discord1.png',
      logo: '/designinspoimages/discordlogo.png',
      images: [
        '/designinspoimages/discord1.png',
        '/designinspoimages/discord2.png',
        '/designinspoimages/discord3.png',
        '/designinspoimages/discord4.png'
      ],
      prompt: prefixText + `Visual Identity

Dark-themed interface with a deep blue-purple gradient background (#1a1625 to #2B2D31)
High contrast design using white text on dark backgrounds for maximum readability
Playful yet professional aesthetic combining rounded corners, animated elements, and bold typography

Design Language
- Neumorphic and glassmorphic elements with subtle shadows and transparency effects
- Extensive use of border-radius (16px-40px) creating a soft, approachable interface
- Dynamic depth layering through strategic z-index management and backdrop filters

Technical Excellence
- Performance-focused implementation with lazy loading and optimized assets
- Responsive fluid design adapting seamlessly across breakpoints
- Sophisticated animation system using CSS transforms and Web Animations API

Section-by-Section Breakdown
1. Navigation Header
Structure & Layout
header {
  position: fixed;
  z-index: 99;
  backdrop-filter: blur(20px);
  background-color: rgba(0, 0, 0, 0.1);
  height: 80px;
}

.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  max-width: 1300px;
  margin: 0 auto;
}

Key Design Elements
- Fixed positioning with glassmorphic backdrop blur effect
- Horizontal navigation with dropdown mega-menus
- Logo placement: Fixed left position at 40px
- Typography:
  - Font: "ABC Ginto Normal" for nav items
  - Size: 16px base
  - Weight: 500 for links
  - Color: White with 0.8 opacity for inactive states

Interactive States
.nav-link {
  padding: 9px 16px;
  border-radius: 16px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Dropdown Animation */
.dropdown-menu {
  opacity: 0;
  transform: translateY(-10px);
  transition: opacity 0.4s, transform 0.4s;
}

Dropdown Mega-Menu Design
- Background: Solid #5865F2 (brand purple)
- Border-radius: 40px for soft appearance
- Padding: 40px internal spacing
- Grid layout: Multi-column structure for organized content
- Animation: Fade in with subtle slide effect

2. Hero Section
Layout Architecture
.hero-section {
  padding-top: 144px;
  padding-bottom: 125px;
  background-image: url('texture-headline.webp');
  background-position: 100% -33%;
  background-size: 95.5%;
}

.hero-content {
  display: flex;
  gap: 34.6px;
  max-width: 1240px;
  margin: 0 auto;
}

Typography Hierarchy
Headline:
- Font: "Ggsans" (custom font)
- Size: 48px
- Line-height: 1.2
- Color: #FFFFFF
- Text-transform: uppercase for emphasis

Subheading:
- Size: 20px
- Line-height: 1.4
- Color: rgba(255, 255, 255, 0.8)
- Max-width: 491px for optimal readability

Visual Elements
- Background texture: Subtle gradient mesh overlay
- Floating decorative elements: Star shapes with parallax effect
- Device mockups: 3D perspective transforms
- Character illustrations: Positioned absolutely with animation

CTA Buttons
.cta-button {
  padding: 16px 32px;
  border-radius: 28px;
  font-size: 20px;
  font-weight: 500;
  background-color: #FFFFFF;
  color: #000000;
  transition: all 0.3s ease;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

3. Feature Sections
Grid-Based Layout
.feature-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  align-items: center;
  padding: 120px 0;
}

/* Alternating layout */
.feature-section:nth-child(even) {
  direction: rtl;
}

Content Cards
- Background: Semi-transparent with blur effect
- Border-radius: 24px
- Padding: 40px
- Shadow: Multi-layered for depth
box-shadow: 
  0 0 0 1px rgba(255, 255, 255, 0.1),
  0 8px 32px rgba(0, 0, 0, 0.2),
  0 24px 64px rgba(0, 0, 0, 0.1);

Media Presentation
Screenshot containers:
- Aspect ratio: 16:9
- Border-radius: 16px
- Overflow: hidden for clean edges

- Device frames: Custom SVG overlays
- Hover effects: Scale transform on interaction

4. Animation System
Decorative Elements
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.floating-element {
  animation: float 3s ease-in-out infinite;
}

Scroll-Triggered Animations
- Intersection Observer implementation for performance
- Staggered delays for sequential reveals
- Transform origins carefully set for natural motion

Micro-Interactions
.interactive-element {
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.interactive-element:active {
  transform: scale(0.95);
}

5. Typography System
Font Stack
--typography-font-family: "Ggsans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--typography-serif-family: "Lyon Text", Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Songti TC", "Songti SC", SimSun, "Nanum Myeongjo", NanumMyeongjo, Batang, serif;
--typography-mono-family: "Consolas", "Monaco", monospace;

Type Scale
- Display: 56px / 1.1 line-height
- Headline: 48px / 1.2 line-height
- Title: 32px / 1.3 line-height
- Body Large: 20px / 1.5 line-height
- Body: 16px / 1.6 line-height
- Caption: 14px / 1.4 line-height

Text Styling
.text-gradient {
  background: linear-gradient(135deg, #5865F2 0%, #EB459E 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

6. Color System
Primary Palette
:root {
  --color-primary: #5865F2;     /* Brand Purple */
  --color-secondary: #EB459E;   /* Brand Pink */
  --color-tertiary: #57F287;    /* Success Green */
  --color-danger: #ED4245;      /* Error Red */
  --color-warning: #FEE75C;     /* Warning Yellow */
}

Neutral Scale
:root {
  --gray-900: #0c0e10;  /* Deepest black */
  --gray-800: #1a1c1f;  /* Background dark */
  --gray-700: #2b2d31;  /* Surface dark */
  --gray-600: #313338;  /* Surface light */
  --gray-500: #41434a;  /* Border dark */
  --gray-400: #686a71;  /* Text muted */
  --gray-300: #9d9fa6;  /* Text secondary */
  --gray-200: #b5bac1;  /* Text primary */
  --gray-100: #dbdee1;  /* Border light */
  --gray-50: #f2f3f5;   /* Surface bright */
}

7. Responsive Design System
Breakpoint Strategy
/* Mobile First Approach */
@media (min-width: 640px) { /* Tablet */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1280px) { /* Wide */ }
@media (min-width: 1536px) { /* Ultra-wide */ }

Fluid Typography
.fluid-text {
  font-size: clamp(32px, 5vw, 56px);
  line-height: clamp(1.2, 1.1 + 0.1vw, 1.1);
}

Container Queries
.adaptive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(20px, 3vw, 40px);
}

8. Component Library
Button Variants
/* Primary Button */
.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 12px 24px;
  border-radius: 24px;
  font-weight: 500;
  box-shadow: 0 4px 14px rgba(88, 101, 242, 0.3);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
}

/* Icon Button */
.btn-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

Card Components
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.2);
}

9. Footer Design
Structure
.footer {
  background: var(--gray-900);
  padding: 80px 0 24px;
  position: relative;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 40px;
  max-width: 1240px;
  margin: 0 auto;
}

Social Links
.social-links {
  display: flex;
  gap: 24px;
}

.social-link {
  width: 32px;
  height: 32px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.social-link:hover {
  opacity: 1;
}

10. Performance Optimizations
Image Loading
<img 
  loading="lazy"
  srcset="image-500w.webp 500w,
          image-800w.webp 800w,
          image-1200w.webp 1200w"
  sizes="(max-width: 640px) 100vw, 
         (max-width: 1024px) 50vw, 
         33vw"
  alt="Description"
/>

CSS Architecture
/* Critical CSS inlined */
/* Non-critical CSS loaded asynchronously */
/* Component-specific CSS code-split */

Animation Performance
.will-animate {
  will-change: transform, opacity;
}

.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
}`
    },
    {
      id: 5,
      company: 'Notion',
      description: 'Flexible workspace with elegant functionality',
      image: '/designinspoimages/notion1.png',
      logo: '/designinspoimages/notionlogo.png',
      images: [
        '/designinspoimages/notion1.png',
        '/designinspoimages/notion2.png',
        '/designinspoimages/notion3.png',
        '/designinspoimages/notion4.png',
        '/designinspoimages/notion5.png'
      ],
      prompt: prefixText + `Executive Summary: Design Philosophy & High-Level Overview
This design system represents a modern, clean, and sophisticated approach to web design that emphasizes clarity, functionality, and visual hierarchy. The overall aesthetic is characterized by:
Core Design Principles

Minimalist Foundation: Clean, uncluttered interfaces with generous whitespace
Typography-First Approach: Strong emphasis on readable, hierarchical text systems
Subtle Sophistication: Refined color palette with strategic accent usage
Smooth Interactions: Thoughtful animations and hover states enhance user experience
Component Consistency: Modular design system ensuring cohesive visual language

Visual Language Characteristics

Color Strategy: Predominantly monochromatic with strategic blue accents (#0075de primary)
Typography Hierarchy: Multi-level system using Inter/NotionInter font family
Spacing System: Consistent mathematical spacing units (8px base grid)
Border Radius: Soft, modern corners (8px standard, 12px for larger elements)
Shadow Usage: Minimal, purposeful shadows for depth and hierarchy


Technical Design System Analysis
1. Typography System
Font Families
css--typography-font-family: 'NotionInter, Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"';
--typography-serif-family: '"Lyon Text", Georgia, YuMincho, "Yu Mincho", "Hiragino Mincho ProN", "Hiragino Mincho Pro", "Songti TC", "Songti SC", SimSun, "Nanum Myeongjo", NanumMyeongjo, Batang, serif';
Typography Scale & Specifications
Title Typography

Font Size: 2.5rem (40px) mobile / 3rem (48px) desktop
Font Weight: 800
Line Height: 3rem (48px) mobile / 4rem (64px) desktop
Letter Spacing: -0.09375rem (-1.5px) mobile / -0.1328125rem (-2.125px) desktop

Heading Typography

Font Size: 2rem (32px) mobile / 2.375rem (38px) desktop
Font Weight: 700
Line Height: 2.5rem (40px) mobile / 3rem (48px) desktop
Letter Spacing: -0.046875rem (-0.75px) mobile / -0.09375rem (-1.5px) desktop

Deck Typography (Large body text)

Font Size: 1.125rem (18px) mobile / 1.25rem (20px) desktop
Font Weight: 400
Line Height: 1.5rem (24px) mobile / 1.75rem (28px) desktop

Body Typography

Font Size: 1rem (16px)
Font Weight: 400
Line Height: 1.5rem (24px)
Letter Spacing: 0

Caption Typography

Font Size: 0.875rem (14px)
Font Weight: 400
Line Height: 1.25rem (20px)
Letter Spacing: 0.0078125rem (0.125px)

2. Color System
Primary Colors
css--color-text-primary: #191918;
--color-text-secondary: #31302e;
--color-text-muted: #00000096;
--color-background: #ffffff;
--color-background-secondary: #f6f5f4;
Interactive Colors
css--color-button-primary: #0075de;
--color-button-primary-hover: #005bab;
--color-button-primary-active: #005bab;
--color-button-secondary: #f2f9ff;
--color-button-secondary-text: #005bab;
--color-button-tertiary: #ffffff;
--color-button-tertiary-border: #0000001a;
System Colors
css--color-border: #0000001a;
--color-border-hover: #0000001a;
--color-badge-primary: #31302e;
--color-badge-secondary: #ffffff;
--color-badge-tertiary: #f2f9ff;
3. Spacing System
The design uses a consistent 8px base grid system:
css--block-spacing-padding-inline: 2rem (32px);
--block-spacing-padding-block: 1.75rem (28px);
--block-spacing-gap: 1.75rem (28px);
--block-spacing-text-gap: 0.25rem (4px);
Standard Padding Values:

Small: 8px
Medium: 16px
Large: 24px
Extra Large: 32px
Container: 40px

4. Component Specifications
Buttons
css/* Primary Button */
.button-primary {
    background: #0075de;
    color: #ffffff;
    border-radius: 0.5rem (8px);
    padding: 4px 14px;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    min-height: 36px;
    transition: background-color 0.15s;
}

/* Secondary Button */
.button-secondary {
    background: #f2f9ff;
    color: #005bab;
    border-radius: 0.5rem (8px);
    padding: 4px 14px;
}

/* Tertiary Button */
.button-tertiary {
    background: #ffffff;
    color: #191918;
    border: 1px solid #0000001a;
    border-radius: 0.5rem (8px);
}
Cards/Blocks
css.block-component {
    background: #f6f5f4;
    border-radius: 0.75rem (12px);
    padding: 1.75rem (28px);
    border: 2px solid #f6f5f4;
    transition: border-color 0.2s;
}

.block-component:hover {
    border-color: #dfdcd9;
}

Section-by-Section Landing Page Breakdown
1. Navigation Bar
Structure:

Grid-based layout: grid-template-columns: 1fr auto 1fr
Height: 64px minimum
Padding: 15px 25px
Background: #ffffff
Position: Sticky top with z-index: 100

Components:

Logo (left): SVG-based, linked to home
Center Navigation: Dropdown menus with hover states
Right Actions: "Log in" link and "Get Started Free" CTA button

Dropdown Specifications:
css.nav-dropdown {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
    padding: 24px;
    min-width: 600px;
}
Typography in Navigation:

Nav items: 16px, medium weight (500)
Dropdown headers: 14px, regular weight (400), color: #00000096
Dropdown links: 18px, semibold (600)

2. Hero Section
Layout Structure:

Full-width container with responsive padding
Two-column grid on desktop, stacked on mobile
Left: Text content
Right: Animated illustrations

Hero Typography:
css.hero-title {
    font-size: 3rem; /* 48px desktop */
    font-weight: 800;
    line-height: 4rem;
    letter-spacing: -0.1328125rem;
    color: #191918;
}

.hero-subtitle {
    font-size: 1.25rem; /* 20px */
    font-weight: 400;
    line-height: 1.75rem;
    color: #191918;
    margin-top: 16px;
}
CTA Buttons:

Primary: Blue (#0075de) background, white text
Secondary: Transparent with text link style
Spacing: 16px gap between buttons

Animated Elements:

Custom animated character illustrations
SVG-based with CSS animations
Smooth transitions on hover/interaction

3. Social Proof Section
Layout:

Centered container with max-width constraint
Horizontal scrolling marquee for logos
Logo specifications:

Height: 32px
Grayscale filter with opacity
Spacing: 36px between logos



Marquee Animation:
css.marquee {
    animation: marqueeFrames 60s linear infinite;
    mask-image: linear-gradient(
        to right, 
        rgba(0, 0, 0, 0), 
        rgb(0, 0, 0) 15%, 
        rgb(0, 0, 0) 85%, 
        rgba(0, 0, 0, 0)
    );
}
4. Feature Cards Section
Grid Layout:

2x2 grid on desktop
Single column on mobile
Gap: 24px between cards

Card Specifications:
css.feature-card {
    background: #f6f5f4;
    border-radius: 12px;
    padding: 28px;
    display: flex;
    align-items: center;
    gap: 16px;
    transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
}
Icon Specifications:

Size: 24px × 24px
Style: Outlined, stroke-width: 2px
Color: #097fe8

5. Quote/Testimonial Section
Layout Structure:

Centered content with max-width: 800px
Video thumbnail with play button overlay
Quote text with attribution

Typography:
css.quote-text {
    font-family: "Lyon Text", Georgia, serif;
    font-size: 1.625rem;
    font-weight: 400;
    line-height: 2rem;
    color: #191918;
}

.quote-attribution {
    font-size: 0.875rem;
    color: #00000096;
    margin-top: 16px;
}
Video Player Overlay:
css.video-overlay {
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    background: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}
6. Product Showcase Section
Carousel Implementation:

Tab-based navigation
Smooth transitions between views
Active tab indicator with underline

Tab Specifications:
css.tab-button {
    padding: 8px 12px;
    color: #00000096;
    font-weight: 500;
    transition: color 0.2s;
}

.tab-button.active {
    color: #191918;
    position: relative;
}

.tab-button.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: #191918;
}
7. CTA Section
Layout:

Centered text alignment
Maximum width: 600px
Vertical spacing: 48px padding

Design Elements:

Large headline (2.375rem)
Descriptive text (1.125rem)
Primary CTA button centered

8. Footer
Structure:

Multi-column layout (4 columns desktop, 2 mobile)
Column categories with link lists
Bottom bar with legal/social links

Typography:
css.footer-heading {
    font-size: 15px;
    font-weight: 600;
    color: #191918;
    margin-bottom: 12px;
}

.footer-link {
    font-size: 14px;
    color: #31302e;
    line-height: 21.6px;
    margin-top: 6.4px;
}

Animation & Interaction Patterns
Hover Effects
css/* Link hover */
a {
    transition: color 0.15s, background-color 0.15s;
    text-underline-offset: 1.6px;
}

/* Card hover */
.card:hover {
    transform: translateY(-2px);
    transition: transform 0.2s ease-out;
}

/* Button hover */
.button:hover {
    background-color: var(--color-button-primary-hover);
    transition: background-color 0.15s;
}
Scroll Animations

Fade-in on scroll for sections
Parallax effects on hero illustrations
Smooth scroll behavior enabled globally

Loading States

Skeleton screens for content loading
Progressive image loading with blur-up effect
Smooth transitions between states


Responsive Design Breakpoints
css/* Mobile First Approach */
/* Base: 0-740px */
/* Tablet: 741px-1023px */
/* Desktop: 1024px+ */

@media (min-width: 741px) {
    /* Tablet styles */
}

@media (min-width: 1024px) {
    /* Desktop styles */
}
Container Widths

Mobile: 100% - 40px padding
Tablet: 100% - 80px padding
Desktop: max-width: 1200px, centered


Advanced Implementation Details from Code Analysis
CSS Custom Properties Structure
The design system uses an extensive custom property system for maintainability:
css/* Base Typography Variables */
--typography-title-font-family: NotionInter, Inter, -apple-system, BlinkMacSystemFont;
--typography-title-font-size: 2.5rem;
--typography-title-font-weight: 800;
--typography-title-line-height: 3rem;
--typography-title-letter-spacing: -0.09375rem;

/* Responsive Typography */
--typography-title-sm-font-size: 3rem;
--typography-title-sm-line-height: 4rem;
--typography-title-sm-letter-spacing: -0.1328125rem;

/* Component-Specific Variables */
--block-border-radius: 0.75rem;
--block-border-width: 2px;
--block-color-background-default: #f6f5f4;
--block-color-background-hover: #f6f5f4;
--block-color-border-hover: #dfdcd9;
Navigation Implementation Details
Dropdown Menu Structure (from JSX):
jsx<div style={{
    boxSizing: 'border-box',
    borderRadius: '8px',
    padding: '8px',
    marginBottom: '-4px'
}}>
    <h3 style={{
        font: 'var(--typography-sans-400-semibold-font-weight) var(--typography-sans-400-semibold-font-size) / var(--typography-sans-400-semibold-line-height) var(--typography-sans-400-semibold-font-family)',
        textWrap: 'balance'
    }}>Menu Item</h3>
    <span style={{
        font: 'var(--typography-sans-50-regular-font-weight) var(--typography-sans-50-regular-font-size) / var(--typography-sans-50-regular-line-height) var(--typography-sans-50-regular-font-family)',
        color: 'var(--color-gray-500)'
    }}>Description text</span>
</div>
Hero Section Advanced Styling
Animated Character Implementation:
css.hero-illustration {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.animated-character {
    width: 128px;
    height: 128px;
    animation: float 3s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
Marquee Implementation
Complete Marquee Structure:
css.marquee-container {
    --marquee-margin-top: 16px;
    --marquee-item-gap: 36px;
    --marquee-margin-inline: -40px;
    --marquee-gradient-percent: 15%;
    --marquee-animation-duration: 60s;
    --marquee-animation: marqueeFrames 60s linear infinite;
    
    contain: paint;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-inline: -40px;
    mask-image: linear-gradient(
        to right, 
        rgba(0, 0, 0, 0), 
        rgb(0, 0, 0) 15%, 
        rgb(0, 0, 0) 85%, 
        rgba(0, 0, 0, 0)
    );
}

@keyframes marqueeFrames {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
}
Interactive Component States
Button State Variations:
css/* Base Button Reset */
button {
    border: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    font-family: inherit;
    -webkit-font-smoothing: antialiased;
}

/* Primary Button States */
.btn-primary {
    background: rgb(0, 117, 222);
    border-color: rgba(255, 255, 255, 0);
    color: rgb(255, 255, 255);
    font-weight: 500;
    min-height: 36px;
    padding: 4px 14px;
    border-radius: 8px;
    transition: all 0.15s ease;
}

.btn-primary:hover {
    background: rgb(0, 91, 171);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 117, 222, 0.2);
}

.btn-primary:active {
    transform: translateY(0);
    box-shadow: none;
}
Grid System Implementation
Responsive Grid Classes:
css.grid-container {
    display: grid;
    gap: 24px;
    padding: 0 20px;
}

/* Mobile First */
.grid-cols-1 { grid-template-columns: 1fr; }

/* Tablet */
@media (min-width: 741px) {
    .grid-cols-md-2 { grid-template-columns: repeat(2, 1fr); }
    .grid-container { padding: 0 40px; }
}

/* Desktop */
@media (min-width: 1024px) {
    .grid-cols-lg-3 { grid-template-columns: repeat(3, 1fr); }
    .grid-cols-lg-4 { grid-template-columns: repeat(4, 1fr); }
}
Image Optimization Patterns
Responsive Image Implementation:
html<picture>
    <source 
        media="(min-width: 741px)" 
        srcset="image-desktop.jpg 1x, image-desktop@2x.jpg 2x"
    />
    <source 
        media="(max-width: 740px)" 
        srcset="image-mobile.jpg 1x, image-mobile@2x.jpg 2x"
    />
    <img 
        src="image-fallback.jpg" 
        alt="Description"
        loading="lazy"
        decoding="async"
        style="width: 100%; height: auto; object-fit: cover;"
    />
</picture>
Advanced Typography Utilities
Text Truncation and Wrapping:
css.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.text-balance {
    text-wrap: balance; /* Modern browsers */
    word-break: break-word; /* Fallback */
}

.text-pretty {
    text-wrap: pretty;
    hyphens: auto;
}
Form Element Styling
Input Field Specifications:
css.input-field {
    background: #ffffff;
    border: 1px solid #0000001a;
    border-radius: 8px;
    padding: 8px 12px;
    font-size: 16px;
    line-height: 24px;
    transition: border-color 0.15s;
}

.input-field:focus {
    outline: none;
    border-color: #0075de;
    box-shadow: 0 0 0 3px rgba(0, 117, 222, 0.1);
}

.input-field::placeholder {
    color: #00000096;
}
Dialog/Modal Implementation
Modal Structure and Styling:
css.modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 999;
}

.modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
}
Performance-Optimized Animations
GPU-Accelerated Transitions:
css.transition-transform {
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
}

.transition-opacity {
    transition: opacity 0.15s ease-out;
    will-change: opacity;
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

Accessibility Considerations

Color Contrast: All text meets WCAG AA standards
Focus States: Visible focus indicators on all interactive elements
Semantic HTML: Proper heading hierarchy and ARIA labels
Keyboard Navigation: Full keyboard support with logical tab order
Screen Reader Support: Descriptive alt text and ARIA attributes


Implementation Guidelines
CSS Architecture

Use CSS custom properties for all design tokens
Component-based styling with BEM methodology
Utility classes for common patterns
Mobile-first responsive approach

Performance Optimizations

Lazy loading for images below the fold
CSS containment for expensive operations
GPU-accelerated animations using transform/opacity
Critical CSS inlined for above-the-fold content`
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Design Modal Component
  const DesignModal = ({ card, onClose }) => {
    const [activeTab, setActiveTab] = useState('gallery');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [copied, setCopied] = useState(false);

    const copyPrompt = async () => {
      try {
        await navigator.clipboard.writeText(card.prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy: ', err);
      }
    };

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % card.images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + card.images.length) % card.images.length);
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center p-2 mr-3">
                <img 
                  src={card.logo} 
                  alt={`${card.company} logo`} 
                  className="w-full h-full object-contain"
                />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900">{card.company}</h2>
            </div>
            
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={copyPrompt}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-900 text-white hover:bg-gray-800'
                }`}
              >
                {copied ? '✓ Copied!' : 'Copy Prompt'}
              </motion.button>
              
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 flex-shrink-0">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'gallery'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Design Gallery
            </button>
            <button
              onClick={() => setActiveTab('howto')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'howto'
                  ? 'text-gray-900 border-b-2 border-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              How to use this
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {activeTab === 'gallery' && (
              <div className="h-full p-6 flex flex-col">
                {/* Image Gallery */}
                <div className="relative flex-1 mb-4">
                  <div className="h-full bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                      src={card.images[currentImageIndex]}
                      alt={`${card.company} design ${currentImageIndex + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  {/* Navigation Arrows */}
                  {card.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {card.images.length}
                  </div>
                </div>

                {/* Thumbnails */}
                {card.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {card.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex ? 'border-gray-900' : 'border-gray-200'
                        }`}
                      >
                        <img 
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'howto' && (
              <div className="h-full p-6 flex flex-col justify-center">
                <div className="max-w-2xl mx-auto">
                  {/* Steps */}
                  <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-gray-900 text-center mb-8">How to use this design prompt</h3>
                    <div className="space-y-4">
                      {[
                        "Copy the design prompt using the button above",
                        "Open Cursor and ensure mode is set to Agent",
                        "Select Claude 4 Sonnet as your model", 
                        "Paste the prompt and add your specific requirements",
                        "Let Cursor transform your design instantly!"
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                          <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-gray-700 text-lg pt-0.5">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative text-center py-32 px-4 pt-40"
      >
        <div className="absolute inset-0 -z-0">
          <motion.div 
            className="absolute top-[-5rem] left-1/2 transform -translate-x-1/2 w-[20rem] h-[20rem] bg-vibe-cyan/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "mirror" }}
          />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-bold text-4xl md:text-5xl lg:text-6xl text-black leading-tight mb-6 tracking-tight"
          >
            Transform your website design in seconds
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Stop wasting time screenshotting websites and telling Cursor to make your design like it. 
            Ready-made design prompts to copy and paste in your Cursor chat.
          </motion.p>
        </div>
      </motion.section>

      {/* Design Cards Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="pb-20 px-4"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {designCards.map((card) => (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.3 }
                }}
                className="group cursor-pointer"
                onClick={() => setSelectedCard(card)}
              >
                <div className="bg-white rounded-xl p-6 h-full transition-all duration-300 hover:shadow-lg border border-gray-200 hover:border-gray-300">
                  {/* Company Logo and Name */}
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center p-2">
                      <img 
                        src={card.logo} 
                        alt={`${card.company} logo`} 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <h3 className="ml-3 text-xl font-semibold text-gray-900">
                      {card.company}
                    </h3>
                  </div>

                  {/* Design Preview */}
                  <div className="mb-6 relative overflow-hidden rounded-lg bg-gray-50">
                    <div className="aspect-[4/3] relative">
                      <img 
                        src={card.image} 
                        alt={`${card.company} design preview`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-base leading-relaxed mb-6">
                    {card.description}
                  </p>

                  {/* CTA Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                      Copy design prompt
                    </span>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center transition-all duration-300"
                    >
                      <svg 
                        className="w-4 h-4 text-gray-600"
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Bottom CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to create your own?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Start building with any of these design styles in minutes
          </p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigateToFeature && onNavigateToFeature('create-project')}
            className="bg-vibe-cyan text-black px-8 py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-200 relative"
          >
            Start building now
            <span className="absolute -top-1 -right-1 text-lg">✨</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Modal */}
      <AnimatePresence
        initial={false}
        onExitComplete={() => null}
      >
        {selectedCard && (
          <DesignModal
            card={selectedCard}
            onClose={() => setSelectedCard(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignInspiration; 