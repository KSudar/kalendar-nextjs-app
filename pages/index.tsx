import CalendarGrid from '@components/CalendarGrid';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';

const Home: NextPage = () => {
	return (
		<div className='container'>
			<Head>
				<title>Calendar app</title>
				<meta name='description' content='Weekly calendar app' />
			</Head>
			<h1>Kalendar App</h1>
			<CalendarGrid></CalendarGrid>
		</div>
	);
};

export default Home;
