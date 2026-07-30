CURSOR IMPLEMENTATION PROMPT — SVG GENERATOR

Project: Project GenesisMilestone: M11 – Visual Production & User ExperienceStatus: Ready for implementationTarget path: docs/development/CURSOR_SVG_GENERATOR_IMPLEMENTATION.md

Mission

Implement an internal SVG Generator for Project Genesis.

The generator shall create production-ready, editable SVG assets from structured templates and validated input data.

Primary use cases:

chart libraries

icon sheets

map overlays

UI component reference sheets

dashboard infographics

branding elements

technical diagrams

developer documentation graphics

The generator must produce deterministic, editable, standards-compliant SVG files.

Read First

Read completely:

docs/development/CURSOR_IMPLEMENTATION_GUIDE.md
docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md
docs/design/VISUAL_PRODUCTION_BACKLOG.md
docs/design/VISUAL_ASSET_CATALOG.md
docs/design/VISUAL_STYLE_GUIDE.md
docs/design/UI_COMPONENT_LIBRARY.md
docs/design/ICON_GUIDELINES.md
docs/design/CHART_GUIDELINES.md
docs/design/MAP_STYLE_GUIDE.md
docs/design/UI_DATA_BINDING_GUIDELINES.md
docs/design/UI_TEXT_GUIDELINES.md
docs/design/UI_LAYOUT_GUIDELINES.md
docs/design/IMAGE_MOCKUP_EXTRACTION_WORKFLOW.md

Follow:

DD-038 Presentation Architecture

DD-039 Design System Architecture

DD-040 Visual Asset Pipeline

DD-041 User Experience Principles

DD-042 UI Data Binding Guidelines

DD-043 UI Text Guidelines

DD-044 UI Layout Guidelines

Scope

Implement a developer-only SVG generation tool that can:

select an SVG asset from the visual backlog

choose a template

enter structured content

preview the generated SVG

validate the SVG

export the SVG

save it to the correct repository folder

update the visual backlog

update the visual asset catalog

append a changelog entry

Initial supported asset categories:

charts
icons
maps
component-library
branding
diagrams

Non-Goals

Do not implement:

raster image generation

AI image generation

cloud rendering

Adobe/Figma integration

arbitrary user-supplied JavaScript

embedded scripts inside SVG

gameplay functionality

autonomous Git push

Route and Security

Implement as a developer-only route:

/dev/svg-generator

Do not expose it in the player-facing navigation.

All write operations must be disabled in production.

Required safeguards:

strict production guard

no inline scripts

no external remote resources

no foreignObject

no event handler attributes

no arbitrary filesystem paths

no path traversal

strict asset ID validation

server-side destination resolution

sanitize all text content

allow only approved SVG elements and attributes

Architecture

Use:

SVG Generator UI
→ Typed API Client
→ NestJS Developer Controller
→ SVG Generation Application Service
→ Template Engine
→ SVG Validator
→ Repository File-System Adapter

React components must not write files directly.

The server must remain authoritative.

Core Model

Suggested types:

type SvgAssetKind =
  | "chart"
  | "icon"
  | "map"
  | "component-library"
  | "branding"
  | "diagram";

interface SvgGenerationRequest {
  assetId: string;
  templateId: string;
  title: string;
  subtitle?: string;
  width: number;
  height: number;
  content: SvgContentModel;
  status: "in-production" | "in-review" | "approved";
}

interface SvgGenerationResult {
  assetId: string;
  filename: string;
  targetPath: string;
  width: number;
  height: number;
  sha256: string;
  warnings: string[];
}

Determinism

The generator must be deterministic.

Given identical:

template

data

dimensions

tokens

version

the generated SVG output must be byte-stable where practical.

Requirements:

stable element ordering

stable attribute ordering

stable numeric formatting

stable whitespace

stable IDs

no random values

no timestamps inside generated SVG unless explicitly requested

no environment-dependent rendering

Template System

Create a template registry.

Suggested initial templates:

chart-library
kpi-card-library
status-panel-library
notifications-library
finance-widget-library
icon-sheet
map-overlay
brand-lockup
technical-diagram

Every template shall define:

supported asset kind

default dimensions

required fields

optional fields

design tokens

layout rules

validation rules

output filename rules

Templates must be implemented as typed modules, not free-form HTML strings.

Design Tokens

Use centralized tokens.

Suggested token groups:

interface SvgDesignTokens {
  background: string;
  panelBackground: string;
  panelBorder: string;
  textPrimary: string;
  textSecondary: string;
  accentPrimary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  grid: string;
  spacing: number[];
  borderRadius: number[];
  fontFamily: string;
}

Do not hardcode colors repeatedly inside templates.

Use one canonical token source aligned with DD-039 and VISUAL_STYLE_GUIDE.md.

Supported SVG Elements

Initial allowlist:

svg
g
defs
style
linearGradient
radialGradient
stop
clipPath
mask
rect
circle
ellipse
line
polyline
polygon
path
text
tspan
title
desc

Disallow:

script
foreignObject
iframe
image with remote URL
animate
set
event attributes
external CSS imports

Charts

Support generation of:

line chart

area chart

bar chart

stacked bar chart

pie chart

donut chart

scatter plot

gauge

sparkline

progress bar

Charts must follow CHART_GUIDELINES.md.

Requirements:

readable axes

optional legends

semantic color use

no decorative 3D effects

accessible title and description

data placeholders supported

consistent margins

responsive viewBox

Icons

Support:

icon grid

icon labels

size variants

state variants

stroke and fill preview

accessibility labels

export-ready symbols

Icons must follow ICON_GUIDELINES.md.

Prefer paths and basic shapes.

Avoid embedded raster images.

Maps

Support:

region outlines

overlay legends

route lines

markers

selection states

heatmap legend blocks

inspector callouts

Maps must follow MAP_STYLE_GUIDE.md.

Initial generator scope is visual reference SVGs and overlays, not a full GIS system.

Text Handling

Follow UI_TEXT_GUIDELINES.md.

Requirements:

sanitize all text

preserve explicit line breaks

use predictable wrapping

no arbitrary HTML

support placeholders such as:

{{revenue}}
{{profit}}
{{playerName}}
{{companyName}}

Do not replace placeholders with fixed runtime values during generation.

Data Binding Notes

Generated reference assets may visually show placeholder syntax.

Production UI implementation must bind data at runtime.

Follow DD-042.

Templates must distinguish:

static label
dynamic placeholder
sample visualization data

Destination Mapping

Use central mapping:

CH-*   → docs/design/charts/
ICON-* → docs/design/icons/
MAP-*  → docs/design/maps/
BR-*   → docs/design/branding/
DB-*   → docs/design/mockups/dashboard/
MM-*   → docs/design/mockups/main-menu/
PR-*   → docs/design/mockups/production/
RS-*   → docs/design/mockups/research/
EC-*   → docs/design/mockups/economy/
TR-*   → docs/design/mockups/logistics/
CP-*   → docs/design/mockups/company/
RP-*   → docs/design/mockups/reports/

For SVG output, preserve the canonical .svg filename from the backlog.

User Interface

Required sections:

Header
Asset selector
Template selector
Dimensions
Content editor
Structured data editor
Design token preview
Live SVG preview
Validation panel
Resolved filename
Resolved destination
Export action
Save action
Recent activity

The user must not manually type repository paths.

Structured Editor

Do not use a raw SVG editor as the primary interface.

Use typed form sections.

Examples:

Chart Library

chart types

labels

sample series

colors

legends

captions

data binding examples

Icon Sheet

icon names

grid size

icon sizes

stroke width

label visibility

Map Overlay

regions

routes

markers

legend

selection state

Provide an optional read-only SVG source preview.

Validation

Validate before preview and save.

Required checks:

valid XML

valid SVG namespace

positive width and height

valid viewBox

no prohibited elements

no prohibited attributes

no external references

no duplicate IDs

no invalid path data

no empty asset

filename matches asset ID

target directory matches asset category

title and desc present for accessibility

text fits within configured bounds where detectable

Warnings:

excessive element count

overly complex paths

tiny text

low contrast

unusually large dimensions

missing placeholder documentation

unsupported font dependency

Accessibility

Every generated SVG must include:

<title>...</title>
<desc>...</desc>

Use:

role="img"
aria-labelledby="..."

where appropriate.

Do not rely on color alone.

Add labels or shapes for critical semantic states.

Safe File Writes

Before save:

validate asset

resolve filename

resolve destination

generate SVG

sanitize SVG

validate final XML

calculate hash

calculate backlog update

calculate catalog update

calculate changelog update

Then write transactionally.

On failure:

restore original Markdown files

remove incomplete SVG

leave no partial state

Visual Asset Manager Integration

Integrate with the previously implemented Visual Asset Manager.

Preferred behavior:

SVG Generator
→ produces validated SVG
→ passes file to Visual Asset Manager import service
→ shared naming, path, duplicate, backlog and catalog logic

Do not duplicate:

path mapping

revision handling

status transitions

backlog parsing

catalog updates

changelog handling

hash detection

Reuse shared application services.

Revision Rules

Default:

CH-010_Charts.svg

Revision:

CH-010_Charts_Rev1.svg
CH-010_Charts_Rev2.svg

Integrated assets require a revision for changes.

Suggested API

GET  /api/dev/svg-generator/templates
GET  /api/dev/svg-generator/templates/:templateId
POST /api/dev/svg-generator/preview
POST /api/dev/svg-generator/validate
POST /api/dev/svg-generator/generate
GET  /api/dev/svg-generator/activity

Use typed request and response contracts.

Tests

Unit Tests

token resolver

template registry

filename resolver

destination resolver

deterministic ID generation

XML escaping

text sanitization

chart geometry generation

path generation

SVG allowlist validation

duplicate ID validation

accessibility metadata generation

Snapshot Tests

one snapshot per template

deterministic output

stable attribute ordering

stable whitespace

placeholder preservation

Integration Tests

generate CH-010_Charts.svg

save via Visual Asset Manager

update backlog

update asset catalog

append changelog

create revision

reject unsafe SVG

rollback after document update failure

Security Tests

script injection

event handler injection

foreignObject injection

external image URL

path traversal

malformed XML

oversized payload

production access rejection

Presentation Tests

template selection

live preview

validation warnings

dimensions

structured editor

successful generation

save confirmation

Performance

The generator must handle:

up to 5,000 SVG elements for reference sheets

responsive live preview

deterministic generation under 500 ms for standard templates

large assets without blocking the UI thread

Use server-side generation.

Debounce preview requests.

Documentation

Create:

docs/development/SVG_GENERATOR_GUIDE.md

Document:

opening the tool

choosing templates

entering content

previewing

validation

exporting

saving

revisions

Visual Asset Manager integration

security restrictions

supported SVG elements

Update:

docs/development/IMPLEMENTATION_PROGRESS.md
docs/project-management/M11_VISUAL_PRODUCTION_PLAN.md

Do not modify ADRs.

Initial Required Template

The first completed template must generate:

CH-010_Charts.svg

It shall include:

line chart

area chart

bar chart

stacked bar chart

pie chart

donut chart

scatter plot

gauge

chart anatomy

interaction states

responsive examples

usage guidelines

DD-042 data-binding examples

accessibility notes

Use the current CH-010_Charts.svg only as a basic reference, not as the final quality target.

Implementation Phases

Phase A — Audit and Architecture

inspect Visual Asset Manager

identify reusable services

define module boundaries

define template contracts

define token source

Phase B — SVG Core

XML builder

sanitization

allowlist validation

deterministic formatting

geometry helpers

accessibility metadata

Phase C — Template Engine

template registry

chart-library template

icon-sheet template

map-overlay template

component-library template

Phase D — API

templates

preview

validate

generate

activity

Phase E — UI

route

template selector

forms

preview

validation

save

Phase F — Integration

Visual Asset Manager reuse

backlog

catalog

changelog

revisions

Phase G — Tests and Documentation

unit

snapshots

integration

security

presentation

guide

implementation report

Completion Criteria

Complete only when:

the user can select an SVG backlog asset

the user can select a typed template

the user can configure structured content

the user can preview the SVG

unsafe SVG content is blocked

output is deterministic

output contains accessibility metadata

output can be exported

output can be saved to the repository

backlog updates automatically

asset catalog updates automatically

changelog updates automatically

revisions work

Visual Asset Manager services are reused

production access is blocked

all tests pass

CH-010_Charts.svg is generated successfully by the tool

Completion Report

Create:

docs/architecture/reviews/M11_SVG_GENERATOR_IMPLEMENTATION_REPORT.md

Include:

# Executive Summary
# Architecture
# Reused Visual Asset Manager Components
# SVG Core
# Template Engine
# Design Tokens
# Validation and Sanitization
# Accessibility
# Determinism
# Developer UI
# Repository Integration
# Security
# Testing
# Documentation
# Remaining Risks
# Final Recommendation

Conclude with exactly one of:

SVG GENERATOR READY

or:

SVG GENERATOR CORRECTIONS REQUIRED

Final Instruction

Implement only the SVG Generator described here.

Do not generate unrelated artwork.

Do not change gameplay systems.

Do not duplicate Visual Asset Manager functionality.

Stop after implementation, tests, documentation, and the completion report.