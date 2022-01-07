import CalendarGrid from '@components/CalendarGrid';
import { createAppointments, getAllApointments } from '@lib/ApiService';
import { TDay } from '@types';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home = ({ allApointments }: { allApointments: TDay[] }) => {
	return (
		<div className='container'>
			<Head>
				<title>Calendar app</title>
				<meta name='description' content='Weekly calendar app' />
			</Head>
			<h1>Kalendar App</h1>
			<CalendarGrid allApointments={allApointments}></CalendarGrid>
		</div>
	);
};

export const getStaticProps = async () => {
	await createAppointments();
	const allAppointments = await getAllApointments();
	return { props: { allAppointments } };
};

export default Home;
