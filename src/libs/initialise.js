import autoRefresh from '../features/auto-refresh';
import changeDeadCommentsColor from '../features/change-dead-comments-color';
import clickCommentIndentToToggle from '../features/click-comment-indent-to-toggle';
import clickRankToVoteUnvote from '../features/click-rank-to-vote-unvote';
import commentsUiTweaks from '../features/comments-ui-tweaks';
import fetchSubmissionTitleFromUrl from '../features/fetch-submission-title-from-url';
import hideReadStories from '../features/hide-read-stories';
import inputFieldTweaks from '../features/input-field-tweaks';
import keyBindingsOnInputFields from '../features/key-bindings-on-input-fields';
import keyBindingsOnItems from '../features/key-bindings-on-items';
import linkifyText from '../features/linkify-text';
import loadMoreLinksInNavbar from '../features/load-more-links-in-navbar';
import moreAccessibleFavorite from '../features/more-accessible-favorite';
import onLinkFocusComment from '../features/on-link-focus-comment';
import openStoryLinksInNewTab from '../features/open-story-links-in-new-tab';
import pastChooseDate from '../features/past-choose-date';
import prefillSubmitTitle from '../features/prefill-submit-title';
import profileLinksDropdown from '../features/profile-links-dropdown';
import replyWithoutLeavingPage from '../features/reply-without-leaving-page';
import showItemInfoOnHover from '../features/show-item-info-on-hover';
import showKarmaLeft from '../features/show-karma-left';
import showTopLeadersKarma from '../features/show-top-leaders-karma';
import showUserInfoOnHover from '../features/show-user-info-on-hover';
import sortStories from '../features/sort-stories';
import toggleAllCommentsAndReplies from '../features/toggle-all-comments-and-replies';

import features from './features';
import {
	isItemJob,
	getUrlParams,
	getOptions,
	isLoggedIn,
	getLoggedInUser
} from './utils';

const featureList = [
	changeDeadCommentsColor,
	clickCommentIndentToToggle,
	clickRankToVoteUnvote,
	commentsUiTweaks,
	fetchSubmissionTitleFromUrl,
	inputFieldTweaks,
	keyBindingsOnInputFields,
	keyBindingsOnItems,
	linkifyText,
	loadMoreLinksInNavbar,
	moreAccessibleFavorite,
	onLinkFocusComment,
	openStoryLinksInNewTab,
	pastChooseDate,
	prefillSubmitTitle,
	profileLinksDropdown,
	replyWithoutLeavingPage,
	showItemInfoOnHover,
	showKarmaLeft,
	showTopLeadersKarma,
	showUserInfoOnHover,
	toggleAllCommentsAndReplies,

	// Options bar (order matters)
	sortStories,
	hideReadStories,
	autoRefresh
];

const getMetadata = new Promise(resolve => {
	const metadata = {
		path: window.location.pathname,
		itemId: undefined,
		user: {
			loggedIn: false,
			name: undefined
		},
		isJob: false,
		options: undefined,
		firstLoad: false
	};

	window.addEventListener('load', async () => {
		metadata.itemId = getUrlParams('id');
		metadata.user.loggedIn = isLoggedIn();
		metadata.user.name = metadata.user.loggedIn ? getLoggedInUser() : undefined;
		metadata.isJob = (metadata.itemId && metadata.path === '/item') ? await isItemJob(metadata.itemId) : false;
		metadata.options = await getOptions;
		resolve(metadata);
	});
});

export async function initialiseAll() {
	const metadata = await getMetadata;
	metadata.firstLoad = true;

	if (metadata.options.logging) {
		console.group('Refined Hacker News');
	}

	for (const feat of featureList) {
		features.add(feat, metadata);
	}

	if (metadata.options.logging) {
		console.groupEnd();
	}
}

export async function initialiseSome(...args) {
	const metadata = await getMetadata;
	metadata.firstLoad = false;

	for (const id of args) {
		const feat = featureList.find(f => f.id === id);
		features.add(feat, metadata);
	}
}
