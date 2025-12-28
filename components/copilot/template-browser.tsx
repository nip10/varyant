"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  experimentTemplates,
  type ExperimentTemplate,
  type TemplateCategory,
  CATEGORY_INFO,
} from "@/lib/templates";
import {
  ArrowRightIcon,
  BeakerIcon,
  ClockIcon,
  SearchIcon,
  SparklesIcon,
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  RepeatIcon,
  XIcon,
  BuildingIcon,
  ZapIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Icons for each template category
 */
const categoryIcons: Record<TemplateCategory, React.ComponentType<{ className?: string }>> = {
  conversion: TrendingUpIcon,
  engagement: UsersIcon,
  pricing: DollarSignIcon,
  retention: RepeatIcon,
};

/**
 * Color classes for each category
 */
const categoryColors: Record<TemplateCategory, { text: string; bg: string; border: string }> = {
  conversion: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
  },
  engagement: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  pricing: {
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
  },
  retention: {
    text: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    border: "border-orange-200 dark:border-orange-800",
  },
};

/**
 * Difficulty badge colors
 */
const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

export interface TemplateBrowserProps {
  /** Callback when a template is selected */
  onSelect: (template: ExperimentTemplate) => void;
  /** Optional callback to close the browser */
  onClose?: () => void;
  /** Optional class name for styling */
  className?: string;
  /** Whether to show in compact mode */
  compact?: boolean;
  /** Maximum height for the browser */
  maxHeight?: string;
}

/**
 * Template Browser Component
 *
 * Allows users to search, filter, and select from pre-built experiment templates.
 */
export function TemplateBrowser({
  onSelect,
  onClose,
  className,
  compact = false,
  maxHeight = "400px",
}: TemplateBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  // Filter templates based on search and category
  const filteredTemplates = useMemo(() => {
    return experimentTemplates.filter((template) => {
      // Category filter
      if (selectedCategory && template.category !== selectedCategory) {
        return false;
      }

      // Search filter
      if (search) {
        const normalizedSearch = search.toLowerCase().trim();
        return (
          template.name.toLowerCase().includes(normalizedSearch) ||
          template.description.toLowerCase().includes(normalizedSearch) ||
          template.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch)) ||
          template.category.toLowerCase().includes(normalizedSearch)
        );
      }

      return true;
    });
  }, [search, selectedCategory]);

  // Group templates by category for display
  const templatesByCategory = useMemo(() => {
    const grouped: Record<TemplateCategory, ExperimentTemplate[]> = {
      conversion: [],
      engagement: [],
      pricing: [],
      retention: [],
    };

    filteredTemplates.forEach((template) => {
      grouped[template.category].push(template);
    });

    return grouped;
  }, [filteredTemplates]);

  const categories: TemplateCategory[] = ["conversion", "engagement", "pricing", "retention"];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
            <BeakerIcon className="size-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Experiment Templates</h3>
            <p className="text-xs text-muted-foreground">
              {experimentTemplates.length} battle-tested templates
            </p>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <XIcon className="size-4" />
          </Button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1.5">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isSelected = selectedCategory === category;
          const colors = categoryColors[category];
          const count = templatesByCategory[category].length;

          return (
            <Button
              key={category}
              variant={isSelected ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(isSelected ? null : category)}
              className={cn(
                "gap-1.5 h-7 text-xs",
                isSelected && colors.bg,
                isSelected && colors.text,
                isSelected && "border-transparent hover:opacity-90"
              )}
            >
              <Icon className="size-3" />
              <span className="capitalize">{category}</span>
              <Badge
                variant="secondary"
                className={cn(
                  "ml-0.5 h-4 px-1 text-[10px]",
                  isSelected && "bg-white/20 text-inherit"
                )}
              >
                {count}
              </Badge>
            </Button>
          );
        })}
      </div>

      {/* Template List */}
      <ScrollArea style={{ maxHeight }} className="pr-3">
        <div className="space-y-2">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <SearchIcon className="size-8 text-muted-foreground/50 mb-2" />
              <p className="text-sm text-muted-foreground">No templates found</p>
              <p className="text-xs text-muted-foreground/70">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onSelect}
                isHovered={hoveredTemplate === template.id}
                onHover={(hovered) => setHoveredTemplate(hovered ? template.id : null)}
                compact={compact}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
        <span>
          {filteredTemplates.length} of {experimentTemplates.length} templates
        </span>
        <span className="flex items-center gap-1">
          <SparklesIcon className="size-3" />
          Based on real A/B test data
        </span>
      </div>
    </div>
  );
}

/**
 * Template Card Component
 */
interface TemplateCardProps {
  template: ExperimentTemplate;
  onSelect: (template: ExperimentTemplate) => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
  compact?: boolean;
}

function TemplateCard({
  template,
  onSelect,
  isHovered,
  onHover,
  compact = false,
}: TemplateCardProps) {
  const Icon = categoryIcons[template.category];
  const colors = categoryColors[template.category];

  return (
    <Card
      className={cn(
        "p-3 cursor-pointer transition-all duration-200 group",
        "hover:border-primary/50 hover:shadow-sm",
        isHovered && "border-primary/50 shadow-sm"
      )}
      onClick={() => onSelect(template)}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      <div className="flex items-start gap-3">
        {/* Category Icon */}
        <div className={cn("shrink-0 rounded-lg p-2", colors.bg)}>
          <Icon className={cn("size-4", colors.text)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-medium text-sm truncate">{template.name}</h4>
            {template.difficulty && (
              <Badge
                variant="secondary"
                className={cn("text-[10px] px-1.5 h-4", difficultyColors[template.difficulty])}
              >
                {template.difficulty}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {template.description}
          </p>

          {/* Meta Row */}
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <ClockIcon className="size-3" />
              {template.duration}
            </span>
            <span className="flex items-center gap-1">
              <UsersIcon className="size-3" />
              {template.minimumSampleSize.toLocaleString()}+ users
            </span>
          </div>

          {/* Examples (if any) */}
          {!compact && template.examples && template.examples.length > 0 && (
            <div className="mt-2 pt-2 border-t border-dashed">
              <div className="flex items-start gap-1.5">
                <BuildingIcon className="size-3 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {template.examples[0].company}:
                  </span>{" "}
                  {template.examples[0].result}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {!compact && (
            <div className="flex flex-wrap gap-1 mt-2">
              {template.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 h-4">
                  {tag}
                </Badge>
              ))}
              {template.tags.length > 3 && (
                <Badge variant="outline" className="text-[10px] px-1.5 h-4">
                  +{template.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>

        {/* Arrow */}
        <ArrowRightIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-all duration-200",
            "opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
          )}
        />
      </div>
    </Card>
  );
}

/**
 * Template Detail Component
 *
 * Shows full details of a selected template before applying.
 */
export interface TemplateDetailProps {
  template: ExperimentTemplate;
  onApply: (template: ExperimentTemplate) => void;
  onBack: () => void;
  className?: string;
}

export function TemplateDetail({ template, onApply, onBack, className }: TemplateDetailProps) {
  const Icon = categoryIcons[template.category];
  const colors = categoryColors[template.category];

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn("shrink-0 rounded-lg p-3", colors.bg)}>
          <Icon className={cn("size-6", colors.text)} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{template.name}</h3>
            <Badge variant="outline" className="capitalize">
              {template.category}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
        </div>
      </div>

      {/* Hypothesis */}
      <div className="rounded-lg bg-muted/50 p-3">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Hypothesis
        </h4>
        <p className="text-sm">{template.hypothesis}</p>
      </div>

      {/* Variants */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border p-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-1">Control</h4>
          <p className="font-medium text-sm">{template.variants.control.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {template.variants.control.description}
          </p>
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
          <h4 className="text-xs font-medium text-primary mb-1">Test Variant</h4>
          <p className="font-medium text-sm">{template.variants.test.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {template.variants.test.description}
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div>
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
          Metrics
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-0">Primary</Badge>
            <span className="text-sm">{template.primaryMetric}</span>
          </div>
          {template.secondaryMetrics.length > 0 && (
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="shrink-0">
                Secondary
              </Badge>
              <span className="text-sm text-muted-foreground">
                {template.secondaryMetrics.join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-semibold">{template.duration}</p>
          <p className="text-xs text-muted-foreground">Duration</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-semibold">{template.minimumSampleSize.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">Min. Sample</p>
        </div>
        <div className="rounded-lg bg-muted/50 p-2">
          <p className="text-lg font-semibold capitalize">{template.difficulty || "Medium"}</p>
          <p className="text-xs text-muted-foreground">Difficulty</p>
        </div>
      </div>

      {/* Examples */}
      {template.examples && template.examples.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Success Stories
          </h4>
          <div className="space-y-2">
            {template.examples.map((example, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <ZapIcon className="size-4 text-yellow-500 shrink-0 mt-0.5" />
                <p>
                  <span className="font-medium">{example.company}:</span>{" "}
                  <span className="text-muted-foreground">{example.result}</span>
                  {example.year && (
                    <span className="text-xs text-muted-foreground/70"> ({example.year})</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-2">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={() => onApply(template)} className="flex-1 gap-2">
          <BeakerIcon className="size-4" />
          Use Template
        </Button>
      </div>
    </div>
  );
}
