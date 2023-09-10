# Contributing to Changelog Focus

Changelog Focus is a community project. We invite your participation through issues and pull requests!

## Ways you can help

### Contributing code

Code dontributions are welcome. If you're new to the project, you can open a pull request to address any open issues.

#### Adding new hosts to allow scraping

To allow scraping from a new host:

- Add the new host to `SCRAPING_ALLOWED_HOSTS` list in `./src/constants/index.ts`
- Add the new host to the list in `./docs/allowed-hosts-for-scraping.md`

Please refrain from adding personal websites to the list.

### Suggesting improvements

There are _a lot_ of suggestions on file. You can help by weighing in on these suggestions, which helps convey community need to other contributors who might pick them up.

There is no need to post a new comment. Just add a :thumbsup: or :heart: to
the top post.

If you have a suggestion of your own, [search the open issues][issues]. If you don't see it, feel free to [open a new issue][open an issue].

[open an issue]: https://github.com/dhruvmisra/changelog-focus/issues/new/choose

### Helping others

You can help with code review, which reduces bugs, and over time has a
wonderful side effect of making the code more readable and therefore more
approachable. It's also a great way to teach and learn. Feel free to jump in!
Be welcoming, appreciative, and helpful.

Please review [these impeccable guidelines][code review guidelines].

You can monitor [issues][] and [discussions][], and help other people who have questions about contributing to Changelog Focus, or using it for their projects.

Feel free to reach out to one of the maintainers if you need help getting started.

[code review guidelines]: https://kickstarter.engineering/a-guide-to-mindful-communication-in-code-reviews-48aab5282e5e
[issues]: https://github.com/dhruvmisra/changelog-focus/issues
[discussions]: https://github.com/dhruvmisra/changelog-focus/discussions
[maintainers]: https://github.com/dhruvmisra/changelog-focus#project-leaders


### Spreading the word

Feel free to star the repository. This will help increase the visibility of the project, therefore attracting more users and contributors to Changelog Focus!


## Coding guidelines

### Prettier

This project formats its source code using Prettier. The most enjoyable way to use Prettier is to let it format code for you when you save. You can [integrate it into your editor][integrate prettier].

Whether you integrate it into your editor or not, a pre-commit hook will run
Prettier before a commit by default.

[integrate prettier]: https://prettier.io/docs/en/editors.html


## Pull Requests

All code changes are incorporated via pull requests, and pull requests are always squashed into a single commit on merging. Therefore there's no requirement to squash commits within your PR, but feel free to squash or restructure the commits on your PR branch if you think it will be helpful. PRs with well structured commits are always easier to review!

Because all changes are pulled into the main branch via squash merges from PRs, we do **not** support overwriting any aspects of the git history once it hits our main branch. Notably this means we do not support amending commit messages, nor adjusting commit author information once merged.

Accordingly, it is the responsibility of contributors to review this type of information and adjust as needed before marking PRs as ready for review and merging.

You can review and modify your local [git configuration][git-config] via `git config`, and also find more information about amending your commit messages [here][amending-commits].

[git-config]: https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration
[amending-commits]: https://docs.github.com/en/github/committing-changes-to-your-project/changing-a-commit-message#rewriting-the-most-recent-commit-message


*Happy contributing!*
