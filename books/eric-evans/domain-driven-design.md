# Domain-Driven Design

Title: *Domain-Driven Design: Tackling Complexity in the Heart of Software*  
Author: Eric Evans  
First published: 2003

## Core Idea

Domain-Driven Design, often shortened to DDD, is an approach for building software in complex business domains. Its main argument is that the most important parts of the software should be shaped by a deep model of the business domain, not only by database schemas, UI screens, or technical frameworks.

DDD is most useful when the problem space is rich, ambiguous, and full of business rules. It is less useful when the system is mostly CRUD, reporting, integration plumbing, or simple workflow automation.

## Why It Matters

Software becomes difficult to change when the code and the business understanding drift apart. DDD tries to keep them aligned by making the domain model explicit in both conversation and code.

The model is not just a diagram or documentation artifact. It should influence naming, object boundaries, invariants, transactions, tests, and collaboration between technical and domain experts.

## Ubiquitous Language

The ubiquitous language is the shared vocabulary used by developers, domain experts, product people, and the code itself.

Good DDD code uses business language directly:

- `Invoice`
- `Policy`
- `Shipment`
- `Account`
- `CreditLimit`
- `OrderLine`
- `Reservation`

Weak DDD code hides business meaning behind technical language:

- `DataObject`
- `Manager`
- `Processor`
- `Helper`
- `Record`
- `Payload`

The language should evolve as the team learns. If the domain experts change the way they describe a concept, the model and code should be reconsidered too.

## Model-Driven Design

Model-driven design means the domain model is not separate from the implementation. The model should be reflected in the code structure and behavior.

A useful model:

- Simplifies a complex business problem.
- Captures rules that matter to the business.
- Makes invalid states harder to represent.
- Gives developers and domain experts a shared way to reason.
- Changes when the team learns something important.

A model is not useful merely because it is detailed. It is useful when it helps the team make better design decisions.

## Strategic Design

Strategic design deals with the large-scale structure of a system.

### Bounded Context

A bounded context is a boundary within which a model has a specific meaning.

The same word can mean different things in different contexts. For example:

- `Customer` in sales may mean a qualified buyer.
- `Customer` in support may mean someone with an active account.
- `Customer` in billing may mean a legal entity responsible for payment.

Trying to force all contexts into one universal model usually creates confusion. DDD recommends making these boundaries explicit.

### Context Map

A context map describes how bounded contexts relate to each other.

Common relationships include:

- Partnership: teams coordinate closely and evolve models together.
- Customer-supplier: one team provides a model or API consumed by another.
- Conformist: one context accepts another context's model with little influence.
- Anticorruption layer: one context translates an external or legacy model into its own model.
- Shared kernel: two contexts share a small, carefully controlled part of a model.
- Separate ways: contexts remain independent and avoid integration where possible.

The context map is both a technical and organizational tool. It helps expose dependencies, ownership, and translation points.

### Core Domain

The core domain is the part of the system that creates the most strategic business value.

DDD encourages teams to protect the core domain from accidental complexity. Generic capabilities should not dominate the design effort.

Examples:

- For a bank, risk evaluation may be core.
- For an ecommerce platform, catalog browsing may not be core, but pricing, fulfillment, or marketplace matching might be.
- For a logistics company, routing and capacity planning may be core.

The core domain deserves the best developers, clearest model, and strongest collaboration with domain experts.

### Supporting and Generic Subdomains

Not every part of the system deserves the same modeling investment.

Supporting subdomains are necessary but not differentiating. They may need custom software, but they are not the main source of advantage.

Generic subdomains are common across many businesses. They can often be bought, outsourced, generated, or implemented with standard tools.

Examples of generic subdomains:

- Authentication
- Billing infrastructure
- Notifications
- Audit logs
- File storage

## Tactical Design

Tactical design deals with patterns used inside a bounded context.

### Entity

An entity has a distinct identity that continues over time, even if its attributes change.

Examples:

- A customer changes address but remains the same customer.
- An order changes status but remains the same order.
- A bank account balance changes but the account identity remains.

Entity equality is usually based on identity, not all attributes.

### Value Object

A value object is defined by its attributes and has no separate identity.

Examples:

- Money
- Address
- DateRange
- EmailAddress
- Coordinates

Value objects should usually be immutable. They are useful for making business concepts explicit and preventing primitive obsession.

Instead of:

```ts
function charge(amount: number, currency: string) {}
```

Prefer a domain concept:

```ts
function charge(total: Money) {}
```

### Aggregate

An aggregate is a consistency boundary around a group of related objects. One entity acts as the aggregate root, and outside code should interact with the aggregate through that root.

Aggregates protect invariants.

Example:

- `Order` is the aggregate root.
- `OrderLine` belongs inside the order.
- The order ensures rules such as minimum quantity, valid status transitions, and total calculation.

Good aggregate design keeps transaction boundaries clear. Aggregates should usually be smaller than people first expect.

### Repository

A repository provides access to aggregates using domain-oriented methods.

It should hide persistence details from domain logic.

Example:

```ts
interface OrderRepository {
  findById(id: OrderId): Promise<Order | null>
  save(order: Order): Promise<void>
}
```

Repositories should not become generic database wrappers full of arbitrary query methods. Their shape should reflect domain needs.

### Factory

A factory encapsulates complex object creation.

Factories are useful when creating a valid aggregate requires multiple steps, default rules, generated identifiers, or coordination between objects.

They prevent construction logic from leaking into application services or controllers.

### Domain Service

A domain service represents domain behavior that does not naturally belong to a single entity or value object.

Use domain services carefully. If every behavior becomes a service, the model becomes procedural and loses expressive power.

Good domain service example:

- Pricing a shipment based on route, weight, carrier rules, and service level.

Weak domain service example:

- `OrderService.updateOrderStatus(order, status)` when the behavior could live on `Order`.

### Application Service

An application service coordinates a use case. It should orchestrate, authorize, load aggregates, call domain behavior, save changes, and publish events.

It should not contain the core business rules itself.

Example responsibilities:

- Start a transaction.
- Load an aggregate.
- Call a method on the aggregate.
- Save the aggregate.
- Return a result or DTO.

### Domain Event

A domain event records that something meaningful happened in the domain.

Examples:

- `OrderPlaced`
- `PaymentAuthorized`
- `ShipmentDispatched`
- `PolicyExpired`

Domain events help decouple follow-up actions from the aggregate that produced the event. They are especially useful for integration, audit trails, notifications, and eventual consistency.

## Layered Architecture

Evans describes a layered architecture that separates responsibilities:

- User interface: handles presentation and user interaction.
- Application layer: coordinates use cases.
- Domain layer: contains business rules and model behavior.
- Infrastructure layer: handles persistence, messaging, frameworks, and external systems.

The domain layer should not depend on infrastructure details. Infrastructure should support the model, not define it.

## Distillation

Distillation is the process of identifying what matters most.

In a large system, not all concepts are equally important. DDD asks teams to find the core domain, separate it from supporting details, and make it understandable.

Useful distillation techniques:

- Separate generic subdomains from core business behavior.
- Create a domain vision statement.
- Keep the core model small enough to reason about.
- Remove accidental complexity from the core.
- Use diagrams selectively to clarify important relationships.

## Refactoring Toward Deeper Insight

DDD assumes the first model will be incomplete. The team learns by building, talking, testing, and observing where the model fails.

Refactoring toward deeper insight means changing the model when new understanding emerges.

Signals that the model needs refinement:

- Domain experts frequently correct the team's language.
- Code names do not match business language.
- Business rules are scattered across controllers, jobs, and database triggers.
- Small changes require edits in many unrelated places.
- Developers cannot explain why an object boundary exists.
- The model allows states the business considers impossible.

## Practical Heuristics

Use DDD when:

- Business complexity is high.
- The domain has many rules and exceptions.
- Domain experts are available.
- The product changes because the business learns.
- Incorrect behavior is costly.
- The system is strategically important.

Be cautious with DDD when:

- The system is mostly CRUD.
- The team cannot access domain experts.
- The domain is simple or already standardized.
- The main challenge is scale, data volume, or integration rather than business logic.
- The organization wants DDD vocabulary without changing collaboration habits.

## Common Mistakes

### Treating DDD as a Folder Structure

Folders named `domain`, `application`, and `infrastructure` do not create DDD by themselves. DDD depends on model quality, language, boundaries, and collaboration.

### Building Large Aggregates

Large aggregates create performance problems, lock contention, and unclear invariants. An aggregate should protect consistency rules that truly need to be enforced together.

### Creating Anemic Models

An anemic model has domain objects that only hold data while services contain all behavior. This often recreates procedural transaction scripts with object-shaped data containers.

### Ignoring Bounded Contexts

Without bounded contexts, teams often try to build one model for the whole company. That model usually becomes vague, overloaded, and hard to change.

### Overusing Domain Services

Domain services are useful, but overuse can drain behavior out of entities and value objects. Prefer placing behavior where the business concept naturally owns it.

## Implementation Checklist

When designing or reviewing a DDD-oriented feature, ask:

- What bounded context does this belong to?
- What business language should appear in the code?
- What aggregate owns the invariant?
- What must be strongly consistent?
- What can be eventually consistent?
- Are we modeling a core, supporting, or generic subdomain?
- Does this behavior belong on an entity, value object, domain service, or application service?
- Are persistence concerns leaking into domain logic?
- Are we using primitives where a value object would clarify intent?
- Does the model prevent invalid business states?

## Example: Order Placement

Possible bounded context: Ordering

Ubiquitous language:

- Order
- Order line
- Product
- Quantity
- Customer
- Placed order
- Cancelled order

Aggregate:

- `Order` as aggregate root.
- `OrderLine` inside the aggregate.

Business invariants:

- An order must have at least one line before placement.
- A placed order cannot be freely edited.
- Quantity must be positive.
- Cancellation may depend on fulfillment status.

Application service flow:

1. Receive a place-order command.
2. Load or create the order aggregate.
3. Call domain behavior such as `order.place()`.
4. Persist the aggregate.
5. Publish `OrderPlaced`.

## Key Takeaways

- DDD is about managing complexity in important business domains.
- The model and code should share the same business language.
- Bounded contexts prevent one overloaded model from spreading across the whole system.
- Aggregates are consistency boundaries, not object graphs to persist wholesale.
- The core domain deserves focused design effort.
- Tactical patterns only matter when they support strategic clarity.
- The model should evolve as the team gains deeper domain insight.

## Related Concepts

- Event storming
- Hexagonal architecture
- Clean architecture
- CQRS
- Event sourcing
- Microservices
- Modular monoliths
- Refactoring
