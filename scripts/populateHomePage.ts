import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const client = createClient({
  projectId: 'mttfjag0',
  dataset: 'production',
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function populateHomePage() {
  const homePageId = 'home-page';
  
  const sections = [
    {
      _type: 'fullWidthSection',
      _key: 'intro',
      container: {
        textColor: 'light',
        contentAlignment: 'center',
        backgroundColor: { value: '#000000' },
        collageItems: [
          {
            _type: 'collageItem',
            _key: 'collage1',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: 'image-b3143357a873e9d79ede33c2f04b144879bc1289-379x417-png',
              },
            },
            alt: 'Class War Sign',
            position: { x: 5, y: 15, width: 20, height: 35 },
            mobilePosition: { x: 5, y: 10, width: 30, height: 25 },
          },
          {
            _type: 'collageItem',
            _key: 'collage2',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: 'image-0d917c179efe78e6866f8041dffa9a377eaaa889-562x345-png',
              },
            },
            alt: 'ICE Sign',
            position: { x: 75, y: 20, width: 22, height: 30 },
            mobilePosition: { x: 65, y: 15, width: 32, height: 28 },
          },
          {
            _type: 'collageItem',
            _key: 'collage3',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: 'image-3395379947c6b2d08fc05522b04983f3b75e4962-617x444-png',
              },
            },
            alt: 'Ida',
            position: { x: 10, y: 60, width: 18, height: 28 },
            mobilePosition: { x: 8, y: 65, width: 28, height: 22 },
          },
          {
            _type: 'collageItem',
            _key: 'collage4',
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: 'image-b610dbab4e447f8f72c5dfaf70571bd86f72bfe6-300x363-png',
              },
            },
            alt: 'Leighton',
            position: { x: 78, y: 65, width: 16, height: 25 },
            mobilePosition: { x: 68, y: 70, width: 26, height: 20 },
          },
        ],
        content: [
          {
            _type: 'block',
            _key: 'intro1',
            children: [
              { _type: 'span', text: 'This is ', marks: [] },
              { _type: 'span', text: 'OUR CITY', marks: ['highlight-blue'] },
              { _type: 'span', text: ' and we have a right to it', marks: [] },
            ],
            style: 'h1',
            markDefs: [
              {
                _key: 'highlight-blue',
                _type: 'highlight',
                variant: 'blue',
              },
            ],
          },
        ],
      },
    },
    {
      _type: 'heroCarouselSection',
      _key: 'hero1',
      slides: [
        {
          _type: 'heroSlide',
          _key: 'slide1',
          textColor: 'light',
          contentAlignment: 'center',
          backgroundColor: { value: 'transparent' },
          backgroundImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-7e65f835cc9f7fff7d3ab67441328fac9ed69917-6720x4480-jpg',
            },
          },
          content: [
            {
              _type: 'block',
              _key: 'h1',
              children: [{ _type: 'span', text: 'Rent Control Now', marks: [] }],
              style: 'h1',
              markDefs: [],
            },
            {
              _type: 'block',
              _key: 'p1',
              children: [{ _type: 'span', text: 'Fighting for affordable housing and tenant protections', marks: [] }],
              style: 'normal',
              markDefs: [],
            },
            {
              _type: 'richTextButton',
              _key: 'btn1',
              text: 'Sign the Petition',
              link: '/campaigns/rent-control',
              variant: 'primary',
              size: 'lg',
            },
          ],
        },
        {
          _type: 'heroSlide',
          _key: 'slide2',
          textColor: 'light',
          contentAlignment: 'center',
          backgroundColor: { value: 'transparent' },
          backgroundImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-7e65f835cc9f7fff7d3ab67441328fac9ed69917-6720x4480-jpg',
            },
          },
          content: [
            {
              _type: 'block',
              _key: 'h2',
              children: [{ _type: 'span', text: 'Workers United', marks: [] }],
              style: 'h1',
              markDefs: [],
            },
            {
              _type: 'block',
              _key: 'p2',
              children: [{ _type: 'span', text: 'Building power through union organizing and solidarity', marks: [] }],
              style: 'normal',
              markDefs: [],
            },
            {
              _type: 'richTextButton',
              _key: 'btn2',
              text: 'Get Involved',
              link: '/get-involved',
              variant: 'secondary',
              size: 'lg',
            },
          ],
        },
        {
          _type: 'heroSlide',
          _key: 'slide3',
          textColor: 'light',
          contentAlignment: 'center',
          backgroundColor: { value: 'transparent' },
          backgroundImage: {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: 'image-7e65f835cc9f7fff7d3ab67441328fac9ed69917-6720x4480-jpg',
            },
          },
          content: [
            {
              _type: 'block',
              _key: 'h3',
              children: [{ _type: 'span', text: 'Community Control', marks: [] }],
              style: 'h1',
              markDefs: [],
            },
            {
              _type: 'block',
              _key: 'p3',
              children: [{ _type: 'span', text: 'Taking back our neighborhoods from corporate developers', marks: [] }],
              style: 'normal',
              markDefs: [],
            },
            {
              _type: 'richTextButton',
              _key: 'btn3',
              text: 'Learn More',
              link: '/about',
              variant: 'accent',
              size: 'lg',
            },
          ],
        },
      ],
    },
    {
      _type: 'bannerSection',
      _key: 'banner1',
      backgroundColor: { value: '#f3f4f6' },
      content: [
        {
          _type: 'block',
          _key: 'b1',
          children: [
            { _type: 'span', text: '🏘️ ', marks: [] },
            { _type: 'span', text: 'Housing is a Human Right', marks: ['strong'] },
            { _type: 'span', text: ' • ', marks: [] },
            { _type: 'span', text: '✊ ', marks: [] },
            { _type: 'span', text: 'Workers United', marks: ['strong'] },
            { _type: 'span', text: ' • ', marks: [] },
            { _type: 'span', text: '🌱 ', marks: [] },
            { _type: 'span', text: 'Community Control', marks: ['strong'] },
          ],
          style: 'normal',
          markDefs: [],
        },
      ],
    },
    {
      _type: 'fullWidthSection',
      _key: 'full1',
      container: {
        textColor: 'dark',
        contentAlignment: 'center',
        backgroundColor: { value: '#F7B32B' },
        content: [
          {
            _type: 'block',
            _key: 'f1',
            children: [{ _type: 'span', text: 'Who We Are', marks: [] }],
            style: 'h2',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'f2',
            children: [
              { _type: 'span', text: 'OurCity Action Buffalo is a ', marks: [] },
              { _type: 'span', text: 'grassroots organization', marks: ['strong'] },
              { _type: 'span', text: ' fighting for economic and racial justice in Western New York. We believe in ', marks: [] },
              { _type: 'span', text: 'community power', marks: ['em'] },
              { _type: 'span', text: ', not corporate greed.', marks: [] },
            ],
            style: 'normal',
            markDefs: [],
          },
          {
            _type: 'richTextButton',
            _key: 'fbtn',
            text: 'Learn More About Us',
            link: '/about',
            variant: 'outline-dark',
            size: 'default',
          },
        ],
      },
    },
    {
      _type: 'twoColumnSection',
      _key: 'two1',
      ratio: '1-2',
      leftColumn: {
        textColor: 'light',
        contentAlignment: 'center',
        backgroundColor: { value: '#3D9BE9' },
        content: [
          {
            _type: 'block',
            _key: 'l1',
            children: [{ _type: 'span', text: 'Rent Control', marks: [] }],
            style: 'h3',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'l2',
            children: [{ _type: 'span', text: 'Fighting for affordable housing', marks: [] }],
            style: 'normal',
            markDefs: [],
          },
        ],
      },
      rightColumn: {
        textColor: 'dark',
        contentAlignment: 'left',
        backgroundColor: { value: 'transparent' },
        content: [
          {
            _type: 'block',
            _key: 'r1',
            children: [{ _type: 'span', text: 'Why Rent Control Matters', marks: [] }],
            style: 'h3',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'r2',
            children: [{ _type: 'span', text: 'Buffalo\'s housing crisis is real:', marks: ['strong'] }],
            style: 'normal',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'r3',
            children: [{ _type: 'span', text: 'Rents up 40% in 5 years', marks: [] }],
            style: 'normal',
            listItem: 'bullet',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'r4',
            children: [{ _type: 'span', text: 'Evictions at record highs', marks: [] }],
            style: 'normal',
            listItem: 'bullet',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'r5',
            children: [{ _type: 'span', text: 'Working families displaced', marks: [] }],
            style: 'normal',
            listItem: 'bullet',
            markDefs: [],
          },
          {
            _type: 'richTextButton',
            _key: 'rbtn',
            text: 'Sign the Petition',
            link: '/campaigns/rent-control',
            variant: 'secondary',
            size: 'lg',
          },
        ],
      },
    },
    {
      _type: 'threeColumnSection',
      _key: 'three1',
      ratio: '1-1-1',
      column1: {
        textColor: 'dark',
        contentAlignment: 'center',
        backgroundColor: { value: '#f3f4f6' },
        content: [
          {
            _type: 'block',
            _key: 'c1h',
            children: [{ _type: 'span', text: '🏠 Housing Justice', marks: [] }],
            style: 'h4',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'c1p',
            children: [{ _type: 'span', text: 'Everyone deserves a safe, affordable place to call home', marks: [] }],
            style: 'normal',
            markDefs: [],
          },
        ],
      },
      column2: {
        textColor: 'dark',
        contentAlignment: 'center',
        backgroundColor: { value: '#f3f4f6' },
        content: [
          {
            _type: 'block',
            _key: 'c2h',
            children: [{ _type: 'span', text: '✊ Worker Power', marks: [] }],
            style: 'h4',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'c2p',
            children: [{ _type: 'span', text: 'Strong unions and fair wages for all workers', marks: [] }],
            style: 'normal',
            markDefs: [],
          },
        ],
      },
      column3: {
        textColor: 'dark',
        contentAlignment: 'center',
        backgroundColor: { value: '#f3f4f6' },
        content: [
          {
            _type: 'block',
            _key: 'c3h',
            children: [{ _type: 'span', text: '🌱 Community Control', marks: [] }],
            style: 'h4',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'c3p',
            children: [{ _type: 'span', text: 'Decisions made by the people, for the people', marks: [] }],
            style: 'normal',
            markDefs: [],
          },
        ],
      },
    },
    {
      _type: 'fullWidthSection',
      _key: 'full2',
      container: {
        textColor: 'dark',
        contentAlignment: 'center',
        backgroundColor: { value: 'transparent' },
        content: [
          {
            _type: 'block',
            _key: 'q1',
            children: [{ _type: 'span', text: 'OurCity Action helped me fight my eviction and win. They showed up when no one else would. This organization is the real deal.', marks: [] }],
            style: 'blockquote',
            markDefs: [],
          },
          {
            _type: 'block',
            _key: 'q2',
            children: [{ _type: 'span', text: '— Maria Rodriguez, West Side Tenant', marks: ['em'] }],
            style: 'normal',
            markDefs: [],
          },
        ],
      },
    },
    {
      _type: 'blogPostsCarouselSection',
      _key: 'blog1',
      heading: 'Latest News & Analysis',
      limit: 8,
      backgroundColor: { value: '#f9fafb' },
    },
    {
      _type: 'pressCarouselSection',
      _key: 'press1',
      heading: 'In The News',
      limit: 6,
      backgroundColor: { value: '#374151' },
    },
    {
      _type: 'eventsCarouselSection',
      _key: 'events1',
      heading: 'Upcoming Actions',
      limit: 8,
      backgroundColor: { value: '#111827' },
    },
  ];

  await client.createOrReplace({
    _id: homePageId,
    _type: 'page',
    title: 'Home',
    slug: { current: 'home', _type: 'slug' },
    sections,
  });

  await client.delete(`drafts.${homePageId}`).catch(() => {});

  console.log('✓ Home page created with OurCity Buffalo brand colors');
}

populateHomePage().catch(console.error);
