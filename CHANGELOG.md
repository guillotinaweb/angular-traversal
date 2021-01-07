# 1.9.4 (2021-01-07)

## Bug fix

-   Do not mutate HttpParams [ebrehault]

# 1.9.3 (2020-11-27)

## Improvement

-   Upgrade to Angular 11 [ebrehault]

# 1.9.2 (2020-09-15)

## Bug fix

-   Fix `traverseHere()` when using prefix [ebrehault]

# 1.9.1 (2020-09-09)

## Bug fix

-   Fix traversed path when prefix is null [ebrehault]

# 1.9.0 (2020-09-03)

## Improvement

-   Refactoring `getQueryParams` in order to support array of parameters and providing a sample of usage [faustoonna]

# 1.8.0 (2020-08-10)

## New feature

-   Allow to change navigation prefix at runtime [ebrehault]

# 1.7.1 (2020-07-24)

## Improvement

-   Allow to traverseHere without querystring [ebrehault]

# 1.7.0 (2020-07-10)

## New feature

-   Use view prefix to lazy load a module [ebrehault]

# 1.6.5 (2020-06-29)

## Improvement

-   Upgrade to Angular 10 [ebrehault]

# 1.6.4 (2020-06-18)

## Bug fix

-   Clean up implicit any [ebrehault]

# 1.6.3 (2020-06-01)

## Bug fix

-   Allow to traverse to parent folder by going to `..` [ebrehault]

# 1.6.2 (2020-05-15)

## Improvement

-   Method to get query parameters easily [ebrehault]

# 1.6.1 (2020-05-11)

## Bug fix

-   Do not replace tile context with traversed state defined before tile instantiation [ebrehault]

# 1.6.0 (2020-05-01)

## New feature

-   `beforeTraverse` observable [ebrehault]

# 1.5.3 (2020-04-10)

## Improvement

-   Compile lazy module on load [ebrehault]
-   Fix Travis so non-tagged version can be merged [ebrehault]

## Bug fix

-   Do not break if tile does not exist [ebrehault]

# 1.5.2 (2020-03-31)

-   `a[traverseTo]` href with fullPath [CarlesLopezMagem]

# 1.5.1 (2020-03-27)

## Improvement

-   `emptyTile`: method allowing to remove current component from a tile [mpellerin]

# 1.5.0 (2020-03-25)

### Breaking changes

-   Remove the `[noAutoTraverse]` attribute, it is not needed anymore as `traverse()` will not update the location if it has been already set by Angular Router [ebrehault]

# 1.4.3 (2020-02-27)

-   Support lazy loading for tiles [ebrehault]

# 1.4.2 (2020-02-25)

-   Fix when Location.back goes back to root [oggers]

# 1.4.1 (2020-02-24)

-   Fix typing

# 1.4.0 (2020-02-24)

-   Support lazy loading [ebrehault]

# 1.3.2 (2020-02-14)

-   Upgrade to Angular 9 [mathilde-pellerin]

# 1.3.1 (2020-02-07)

-   Fix change detection on traverser-outlet [mathilde-pellerin]

# 1.3.0 (2020-01-28)

-   Tiles support

# 1.2.8 (2020-01-27)

-   Fix build and upgrade to Angular 8

# 1.2.7 (2020-01-24)

-   Auto-tagging and auto-release on NPM

# 1.2.6 (2019-10-27)

-   Fix traversing on root

# 1.2.5 (2019-10-16)

-   Setup auto-tagging

# 1.2.4 (2019-10-13)

-   Fix demo and package.json

# 1.2.3 (2019-09-30)

-   Fix typing

# 1.2.2 (2019-09-29)

-   Add noAutoTraverse parameter to block traverse on location change if routing (Eric Brehault)

# 1.2.1 (2019-09-26)

-   Normalize path before resolving when called from outside (Mathilde Pellerin)

# 1.2.0 (2019-09-01)

-   Support usage with routing (ebrehault)

# 1.1.1 (2019-06-15)

-   Remove generated e2e tests (Mathilde Pellerin)
-   Remove protractor, karma and jasmine dependencies (as we are using jest) (Mathilde Pellerin)

# 1.1.0 (2019-06-14)

-   Upgrade angular to version 7.2.0 (Mathilde Pellerin)
-   Build the project using angular cli (Mathilde Pellerin)
-   Unit tests with Jest instead of Karma (Mathilde Pellerin)
-   fix request header (Thomas Desvenain)

# 1.0.6 (2018-09-20)

-   traverseHere utility (Eric BREHAULT)

# 1.0.5 (2018-03-20)

## Bug fixes

-   Fix IE support by switching from URLSearchParams to HttpParams from @angular/common/http (Sune Wøller)

-   When we change query string but not context, we request backend. (Thomas Desvenain)

# 1.0.4 (2017-11-04)

## New features

-   Add querystring to target. (Thomas Desvenain)

-   Use tsconfig path mapping to configure module-name-> location for test project. (Sune Wøller)

-   Switch from angular/http to angular/common/http. (HttpClient) (Sune Wøller)

-   Angular 5.0.0 compliancy. (Eric Bréhault)

# 1.0.3 (2017-09-24)

## Bug fixes

-   Declare Target interface and no implicit any. (Thomas Desvenain)

# 1.0.2 (2017-09-06)

## Bug fixes

-   Do not re-use context if empty.

# 1.0.1 (2017-09-06)

## Bug fixes

-   Preserve previous location if no context path.

# 1.0.0-alpha.14 (2017-05-29)

## New features

Expose real href attribute on A tags.

# 1.0.0-alpha.13 (2017-05-20)

## Bug fixes

Initialize contextPath properly.

# 1.0.0-alpha.12 (2017-05-15)

## New features

Extract querystring from path and pass it to resolver.

# 1.0.0-alpha.11 (2017-04-19)

## New features

Return the context path.

# 1.0.0-alpha.10 (2017-03-30)

## New features

Allow to provide path normalizer.

# 1.0.0-alpha.9 (2017-03-24)

## New features

Upgrade to Angular 4.0.0.

## Bug Fixes

Fix BasicHttpResolver backend url injection.

# 1.0.0-alpha.8 (2017-03-15)

Initial release.
