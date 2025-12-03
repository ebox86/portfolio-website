import React from 'react';
import Image from 'next/image';
import { FaDownload } from 'react-icons/fa';
import { PortableText } from '@portabletext/react';
import client from '../../sanityClient';

type Experience = {
  startYear: number;
  endYear?: number;
  company: string;
  roleTitle?: string;
  employmentType?: string;
  mode?: string;
  location?: string;
  description: string;
  skills?: string[];
  logo?: {
    asset?: {
      url?: string;
      metadata?: { lqip?: string };
    };
  };
};

type ActivityPhoto = {
  title?: string;
  caption?: string;
  imageUrl: string;
  blurDataURL?: string;
  imagePosition?: string;
};

type AboutPageProps = {
  experiences: Experience[];
  introHeading?: string;
  introSubheading?: string;
  bio?: any;
  resumeUrl?: string;
  headerImage?: {
    url?: string;
    blurDataURL?: string;
  };
  activities: {
    title?: string;
    photos: ActivityPhoto[];
  };
};


const AboutPage: React.FC<AboutPageProps> = ({ experiences, introHeading, introSubheading, activities, resumeUrl, bio, headerImage }) => {
  const formatEmployment = (value?: string) => {
    if (!value) return 'Full-time';
    return value
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('-');
  };

  const activityPhotos: ActivityPhoto[] =
    activities?.photos?.filter((p) => p.imageUrl) ?? [
      {
        title: 'Weekend mileage + sunrise vibes',
        caption: 'Weekend mileage + sunrise vibes',
        imageUrl: '/images/running.jpg',
        blurDataURL:
          'data:image/jpeg;base64,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',
      },
      {
        title: 'Serving + building community',
        caption: 'Serving + building community',
        imageUrl: '/images/volunteering_1.jpg',
        blurDataURL:
          'data:image/jpeg;base64,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',
        imagePosition: '30% center',
      },
    ];

  return (
    <div className="w-full space-y-8">
      <header className="relative space-y-4 after:content-[''] after:block after:clear-both">
        {headerImage?.url && (
          <div className="relative hidden md:block w-full max-w-[500px] aspect-[880/375] md:float-right md:ml-8 md:mb-4">
            <div className="activity-stack group h-full">
              <span className="activity-layer layer-one" aria-hidden />
              <span className="activity-layer layer-two" aria-hidden />
              <span
                aria-hidden
                className="absolute inset-10 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(192,132,252,0.18))',
                  transform: 'rotate(-6deg) translate(-18px, 16px)',
                  boxShadow: '0 14px 34px rgba(0,0,0,0.12)',
                }}
              />
              <span
                aria-hidden
                className="absolute inset-8 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(110,231,183,0.18), rgba(99,102,241,0.18))',
                  transform: 'rotate(7deg) translate(18px, -12px)',
                  boxShadow: '0 14px 34px rgba(0,0,0,0.10)',
                }}
              />
              <span
                aria-hidden
                className="absolute inset-6 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(250,204,21,0.22), rgba(168,85,247,0.2))',
                  transform: 'rotate(-3deg) translate(-8px, 10px)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.12)',
                }}
              />
              <span
                aria-hidden
                className="absolute inset-5 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(52,211,153,0.18), rgba(99,102,241,0.2))',
                  transform: 'rotate(4deg) translate(12px, -6px)',
                  boxShadow: '0 16px 36px rgba(0,0,0,0.1)',
                }}
              />
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none transform -translate-x-2 -translate-y-2 transition-transform duration-300 ease-out group-hover:translate-x-3 group-hover:translate-y-3 z-30"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ec4899, #6366f1)',
                  padding: '4px',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  borderRadius: '24px',
                  opacity: 0.95,
                }}
              />
              <div className="absolute inset-4 rounded-3xl bg-gradient-to-br from-orange-300/35 via-fuchsia-300/28 to-indigo-300/28 blur-3xl opacity-90 pointer-events-none" />
              <div className="activity-photo -rotate-2">
                <div className="absolute inset-0">
                  <Image
                    src={headerImage.url}
                    alt="Header portrait"
                    fill
                    className="object-cover"
                    placeholder={headerImage.blurDataURL ? 'blur' : undefined}
                    blurDataURL={headerImage.blurDataURL}
                    sizes="(max-width: 768px) 90vw, 32vw"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 via-fuchsia-300/16 to-indigo-300/16 pointer-events-none" />
              </div>
            </div>
          </div>
        )}
        <div className="space-y-3">
          <h1 className="text-5xl font-bold text-gray-800 dark:text-white">Me</h1>
          <p className="text-lg text-gray-700 dark:text-gray-200">
            {introHeading || "I’m Evan 👨‍💻, a passionate infrastructure developer ⚙️ with over 12 years of experience in the tech industry 💼."}
          </p>
          {introSubheading && <p className="text-gray-600 dark:text-gray-300">{introSubheading}</p>}
          {bio && (
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <PortableText value={bio} />
            </div>
          )}
        </div>
      </header>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Professional Experience</h2>
      {/* Experience Timeline */}
      <div className="experience-timeline">
        {experiences.map((experience, index) => {
          const yearTagSource = experience.startYear || experience.endYear;
          const yearTag = yearTagSource ? yearTagSource.toString().slice(-2).padStart(2, '0') : '';
          return (
          <React.Fragment key={experience.company}>
            <div className="experience-card group">
              <div className="flex space-x-4 items-center experience-entry">
                <div className="year-column w-1/4">
                  <div className="year-box">{experience.startYear}</div>
                </div>
                <div className="details w-3/4 relative experience-lift">
                  <span className="experience-year-ghost">{yearTag}</span>
                  <div className="experience-content relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden flex items-center justify-center text-xs text-gray-500 dark:text-gray-300">
                      {experience.logo?.asset?.url ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={experience.logo.asset.url}
                            alt={`${experience.company} logo`}
                            fill
                            className="rounded-full object-cover"
                            placeholder={experience.logo.asset.metadata?.lqip ? 'blur' : undefined}
                            blurDataURL={experience.logo.asset.metadata?.lqip}
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <span>{experience.company.charAt(0)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{experience.company}</h3>
                      {experience.roleTitle && (
                        <p className="text-sm text-gray-600 dark:text-gray-300">{experience.roleTitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 py-2">
                    <span className="bg-amber-100 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full dark:bg-amber-200 dark:text-amber-900">
                      ⏰ {formatEmployment(experience.employmentType)}
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 text-xs font-semibold px-3 py-1 rounded-full dark:bg-emerald-200 dark:text-emerald-900">
                      {experience.mode === 'on-site' ? '🏢 On-site' : experience.mode === 'hybrid' ? '🏠/🏢 Hybrid' : '💻 Remote'}
                    </span>
                    <span className="bg-slate-200 text-slate-900 text-xs font-semibold px-3 py-1 rounded-full dark:bg-slate-600 dark:text-slate-100">
                      📍 {experience.location || 'US'}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{experience.description}</p>
                  {experience.skills && (
                    <div className="flex flex-wrap py-2">
                      {experience.skills.map((skill, skillIndex) => (
                        <span key={skillIndex} className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 mb-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  </div>
                </div>
              </div>
            </div>
            {index !== experiences.length - 1 && <hr className="my-4 border-t border-gray-300 dark:border-gray-500" />}
          </React.Fragment>
        )})}
      </div>
      {/* Resume */}
      <div className="flex space-x-4 items-center">
        <a 
          href={resumeUrl || '/resume.pdf'}
          download 
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition"
        >
          <FaDownload />
          <span>Download Resume</span>
        </a>
      </div>
      {/* Personal Activities */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Personal Activities</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activityPhotos.slice(0, 2).map((photo, idx) => (
            <div key={idx} className="activity-stack group h-64 md:h-72">
              <span className="activity-layer layer-one" aria-hidden />
              <span className="activity-layer layer-two" aria-hidden />
              {idx === 0 && <span className="activity-tape" aria-hidden />}
              <div className={`activity-photo ${idx === 0 ? '-rotate-2' : 'rotate-2'}`}>
                <Image
                  src={photo.imageUrl}
                  fill
                  alt={photo.title || 'Activity'}
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={photo.imagePosition ? { objectPosition: photo.imagePosition } : undefined}
                  placeholder={photo.blurDataURL ? 'blur' : undefined}
                  blurDataURL={photo.blurDataURL}
                />
              </div>
              <div className="activity-label">{photo.caption || photo.title}</div>
            </div>
          ))}
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-200">
          Outside of my professional life, I&apos;m an avid runner 🏃‍♂️, hiker 🥾, skiier ⛷️ and take great pride in contributing back to the community through volunteering.
        </p>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const experiences = await client.fetch(
    `*[_type == "professionalExperience"]|order(coalesce(order,0) desc, startYear desc){
      company,
      roleTitle,
      startYear,
      endYear,
      employmentType,
      mode,
      location,
      description,
      skills,
      logo{
        asset->{
          url,
          metadata{lqip}
        }
      }
    }`
  );

  const aboutSettings = await client.fetch(
    `*[_id in ["aboutSettings", "drafts.aboutSettings"]]|order(_updatedAt desc)[0]{
      introHeading,
      introSubheading,
      bio,
      resume{asset->{url}},
      headerImage{
        asset->{url, metadata{lqip}}
      }
    }`
  );

  const activitiesDoc = await client.fetch(
    `*[_type == "personalActivity" && (_id == "personalActivity" || slug.current == "personalActivity")][0]{
      title,
      photos[]|order(coalesce(order, 999)){
        title,
        caption,
        imagePosition,
        image{
          asset->{
            url,
            metadata{lqip}
          }
        }
      }
    }`
  );

  const activities = {
    title: activitiesDoc?.title,
    photos: (activitiesDoc?.photos || []).map((p: any) => ({
      title: p?.title,
      caption: p?.caption,
      imageUrl: p?.image?.asset?.url,
      blurDataURL: p?.image?.asset?.metadata?.lqip,
      imagePosition: p?.imagePosition,
    })),
  };

  return {
    props: {
      experiences: experiences || [],
      introHeading: aboutSettings?.introHeading || null,
      introSubheading: aboutSettings?.introSubheading || null,
      bio: aboutSettings?.bio || null,
      resumeUrl: aboutSettings?.resume?.asset?.url || null,
      headerImage: aboutSettings?.headerImage?.asset
        ? {
            url: aboutSettings.headerImage.asset.url,
            blurDataURL: aboutSettings.headerImage.asset.metadata?.lqip,
          }
        : null,
      activities,
    },
    revalidate: 600,
  };
}

export default AboutPage;
