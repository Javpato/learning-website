import { NetworkEntry } from '@/components/cs/network-lab/Entry';
import { ResourceDirectory } from '@/components/cs/network-lab/ResourceDirectory';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { notFound } from 'next/navigation';
import { isLocale } from '@/lib/i18n/config';
import { csCrumb, homeCrumb } from '@/lib/nav';
export const metadata={title:'Réseaux — Learning'};
export default function Page({params}:{params:{locale:string}}){
 if(!isLocale(params.locale))notFound();
 const locale=params.locale;
 const title=locale==='fr'?'Réseaux':locale==='en'?'Networks':'Redes';
 return <><Breadcrumbs items={[homeCrumb(locale),csCrumb(locale),{label:title}]}/><NetworkEntry locale={locale}/><ResourceDirectory locale={locale}/></>;
}
